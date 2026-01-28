package com.suman.Ecommerce_beckend.controller;

import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.suman.Ecommerce_beckend.exception.OrderException;
import com.suman.Ecommerce_beckend.model.Order;
import com.suman.Ecommerce_beckend.repository.OrderRepository;
import com.suman.Ecommerce_beckend.response.ApiResponse;
import com.suman.Ecommerce_beckend.response.PaymentLinkResponse;
import com.suman.Ecommerce_beckend.service.OrderService;
import com.suman.Ecommerce_beckend.service.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PaymentController {

    @Value("${razorpay.api.key}")
    String apiKey;

    @Value("${razorpay.api.secret}")
    String apiSecret;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/payments/{orderId}")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(@PathVariable Long orderId,
                                                                 @RequestHeader("Authorization") String jwt) throws OrderException, RazorpayException {
        Order order = null;
        try {
            order = orderService.findOrderById(orderId);
            System.out.println("Order found: " + order.getId());
            System.out.println("Order Total Price: " + order.getTotalPrice());
            System.out.println("User: " + order.getUser().getFirstName() + " " + order.getUser().getEmail());
        } catch (Exception e) {
            System.err.println("Error finding order: " + e.getMessage());
            throw new OrderException("Order not found with id: " + orderId);
        }

        try {
            if (apiKey == null || apiKey.isEmpty() || apiSecret == null || apiSecret.isEmpty()) {
                throw new RazorpayException("Razorpay API credentials are not configured properly");
            }

            // If we've already created a payment link for this order and saved its id, reuse it:
            if (order.getPaymentDetails() != null && order.getPaymentDetails().getRazorpayPaymentLinkId() != null
                    && !order.getPaymentDetails().getRazorpayPaymentLinkId().isEmpty()) {
                PaymentLinkResponse res = new PaymentLinkResponse();
                res.setPayment_link_id(order.getPaymentDetails().getRazorpayPaymentLinkId());
                res.setPayment_link_url(order.getPaymentDetails().getRazorpayPaymentLinkUrl()); // may be null if not saved previously
                return new ResponseEntity<>(res, HttpStatus.OK);
            }

            RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);
            System.out.println("Razorpay client created successfully");

            JSONObject paymentLinkRequest = new JSONObject();
            paymentLinkRequest.put("amount", order.getTotalDiscountedPrice() * 100);
            paymentLinkRequest.put("currency", "INR");

            // Make reference_id unique so Razorpay doesn't block duplicate creation
            String uniqueReference = orderId + "-" + System.currentTimeMillis();
            paymentLinkRequest.put("reference_id", uniqueReference);
            System.out.println("Amount: " + (order.getTotalPrice() * 100) + ", reference: " + uniqueReference);

            JSONObject customer = new JSONObject();
            customer.put("name", order.getUser().getFirstName());
            customer.put("email", order.getUser().getEmail());
            paymentLinkRequest.put("customer", customer);

            JSONObject notify = new JSONObject();
            notify.put("sms", true);
            notify.put("email", true);
            paymentLinkRequest.put("notify", notify);

            // keep a callback to your frontend which knows the order id
            paymentLinkRequest.put("callback_url", "http://localhost:3000/payment/" + orderId);
            paymentLinkRequest.put("callback_method", "get");

            PaymentLink payment = razorpayClient.paymentLink.create(paymentLinkRequest);

            String paymentLinkId = payment.get("id");      // e.g. pl_XXXX
            String paymentLinkUrl = payment.get("short_url"); // short URL for user
            System.out.println("Payment Link ID: " + paymentLinkId);
            System.out.println("Payment Link URL: " + paymentLinkUrl);

            // Save link info to order so we can reuse/check later
            if (order.getPaymentDetails() == null) {
                order.setPaymentDetails(new com.suman.Ecommerce_beckend.model.PaymentDetails());
            }
            order.getPaymentDetails().setRazorpayPaymentLinkId(paymentLinkId);
            order.getPaymentDetails().setRazorpayPaymentLinkReferenceId(uniqueReference);
            order.getPaymentDetails().setRazorpayPaymentLinkUrl(paymentLinkUrl);
            order.getPaymentDetails().setRazorpayPaymentLinkStatus(
                    payment.has("status") ? payment.get("status") : "created"
            );
            orderRepository.save(order); // persist the link info

            PaymentLinkResponse res = new PaymentLinkResponse();
            res.setPayment_link_id(paymentLinkId);
            res.setPayment_link_url(paymentLinkUrl);

            return new ResponseEntity<>(res, HttpStatus.CREATED);

        } catch (RazorpayException e) {
            // if Razorpay complains about duplicate reference_id even now, we can surface a more helpful message
            String msg = e.getMessage();
            System.err.println("Razorpay Exception: " + msg);
            // Let original exception propagate but include clearer text
            throw new RazorpayException("Razorpay Error while creating payment link: " + msg);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RazorpayException("Error creating payment link: " + e.getMessage());
        }
    }


    @GetMapping("/payments")
    public ResponseEntity<ApiResponse> redirect(
            @RequestParam(name="razorpay_payment_id", required = false) String paymentId,
            @RequestParam(name="razorpay_payment_link_id", required = false) String paymentLinkId,
            @RequestParam(name="razorpay_payment_link_reference_id", required = false) String paymentLinkReferenceId,
            @RequestParam(name="razorpay_payment_link_status", required = false) String paymentLinkStatus,
            @RequestParam(name="razorpay_signature", required = false) String signature,
            @RequestParam(name="orderId", required = false) String orderIdParam) throws OrderException, RazorpayException {

        Long orderId = null;

        // Primary: frontend passes numeric order id inside razorpay_payment_link_reference_id
        if (paymentLinkReferenceId != null && !paymentLinkReferenceId.isEmpty()) {
            try {
                orderId = Long.parseLong(paymentLinkReferenceId);
            } catch (NumberFormatException e) {
                // maybe reference is "123-161234123", try prefix
                String prefix = paymentLinkReferenceId.split("-")[0];
                try {
                    orderId = Long.parseLong(prefix);
                } catch (Exception ex) {
                    // fallback to explicit orderId param
                }
            }
        }

        if (orderId == null && orderIdParam != null && !orderIdParam.isEmpty()) {
            try {
                orderId = Long.parseLong(orderIdParam);
            } catch (NumberFormatException ignored) {}
        }

        if (orderId == null) {
            ApiResponse res = new ApiResponse();
            res.setMessage("Invalid order ID");
            res.setStatus(false);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

        Order order = orderService.findOrderById(orderId);

        try {
            if ("paid".equals(paymentLinkStatus)) {
                if (paymentId != null && !paymentId.isEmpty()) {
                    order.getPaymentDetails().setPaymentId(paymentId);
                } else if (paymentLinkId != null && !paymentLinkId.isEmpty()) {
                    order.getPaymentDetails().setPaymentId(paymentLinkId);
                }

                order.getPaymentDetails().setStatus("COMPLETED");
                order.setOrderStatus("PLACED");
                orderRepository.save(order);

                System.out.println("Order " + orderId + " updated successfully");
            } else {
                System.out.println("Payment not completed. Status: " + paymentLinkStatus);
            }

            ApiResponse res = new ApiResponse();
            res.setMessage("your order get placed");
            res.setStatus(true);

            return new ResponseEntity<>(res, HttpStatus.ACCEPTED);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RazorpayException(e.getMessage());
        }
    }

}