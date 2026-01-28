package com.suman.Ecommerce_beckend.security.oauth2;

import com.suman.Ecommerce_beckend.config.JwtProvider;
import com.suman.Ecommerce_beckend.util.CookieUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        String token = jwtProvider.generateToken(authentication);

        String redirectUri = CookieUtils.getCookie(
                        request,
                        HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME
                )
                .map(Cookie::getValue)
                .orElse("http://localhost:3000/oauth2/redirect");

        String targetUrl = UriComponentsBuilder
                .fromUriString(redirectUri)
                .queryParam("token", token)
                .build()
                .toUriString();

        authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
        response.sendRedirect(targetUrl);
    }

}