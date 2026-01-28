package com.suman.Ecommerce_beckend.repository;

import com.suman.Ecommerce_beckend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {

    public Category findByName(String name);

    @Query("Select c from Category c where c.name=:name AND c.parentCategory.name=:parentCategoryName")
    public Category findByNameAndParent(@Param("name") String name, @Param("parentCategoryName")String parentCategoryName);

    //admin
    @Query("SELECT c FROM Category c WHERE c.name = :name AND c.level = :level")
    public Category findByNameAndLevel(@Param("name") String name, @Param("level") int level);

    @Query("SELECT c FROM Category c WHERE c.name = :name AND c.parentCategory.name = :parentCategoryName AND c.level = :level")
    public Category findByNameAndParentCategoryNameAndLevel(
            @Param("name") String name,
            @Param("parentCategoryName") String parentCategoryName,
            @Param("level") int level
    );
}
