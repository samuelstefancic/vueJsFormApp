# Spring Boot API Specification

> 🏗️ **Author:** Winston (Architect Agent)
> **Target:** Spring Boot 3.x with Java 17+
> **Database:** PostgreSQL with JSONB support

---

## Project Structure

```
src/main/java/com/yourcompany/formsapi/
├── FormsApiApplication.java
│
├── config/
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── JacksonConfig.java
│
├── controller/
│   ├── FormController.java
│   └── SubmissionController.java
│
├── service/
│   ├── FormService.java
│   ├── SubmissionService.java
│   └── ValidationService.java
│
├── repository/
│   ├── FormRepository.java
│   └── SubmissionRepository.java
│
├── entity/
│   ├── Form.java
│   └── Submission.java
│
├── dto/
│   ├── FormDto.java
│   ├── FormSummaryDto.java
│   ├── FormCreateDto.java
│   ├── FormUpdateDto.java
│   ├── SubmissionDto.java
│   ├── SubmitRequestDto.java
│   └── ValidationResultDto.java
│
├── validation/
│   ├── FieldValidator.java
│   ├── SchemaValidator.java
│   └── validators/
│       ├── TextValidator.java
│       ├── NumberValidator.java
│       ├── EmailValidator.java
│       ├── PhoneValidator.java
│       ├── UrlValidator.java
│       ├── SelectValidator.java
│       ├── CheckboxValidator.java
│       ├── DateValidator.java
│       ├── TimeValidator.java
│       ├── RatingValidator.java
│       ├── SliderValidator.java
│       └── MultiselectValidator.java
│
└── exception/
    ├── FormNotFoundException.java
    ├── ValidationException.java
    └── GlobalExceptionHandler.java
```

---

## Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <groupId>com.yourcompany</groupId>
    <artifactId>forms-api</artifactId>
    <version>1.0.0</version>
    <name>Forms API</name>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- PostgreSQL -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JSON Processing -->
        <dependency>
            <groupId>com.vladmihalcea</groupId>
            <artifactId>hibernate-types-60</artifactId>
            <version>2.21.1</version>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

---

## Entity Classes

### `entity/Form.java`

```java
package com.yourcompany.formsapi.entity;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "forms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Form {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    /**
     * Store the complete form schema as JSONB
     * Structure: { version, title, fields: [...] }
     */
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> schema;

    @Column(name = "owner_id")
    private UUID ownerId;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
```

### `entity/Submission.java`

```java
package com.yourcompany.formsapi.entity;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    private Form form;

    @Column(name = "form_title")
    private String formTitle;

    /**
     * Store submission data as JSONB
     * Structure: { fieldId: value, ... }
     */
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> data;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();
}
```

---

## DTOs

### `dto/FormDto.java`

```java
package com.yourcompany.formsapi.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class FormDto {
    private String id;
    private String title;
    private Map<String, Object> schema;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### `dto/FormSummaryDto.java`

```java
package com.yourcompany.formsapi.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FormSummaryDto {
    private String id;
    private String title;
    private Integer fieldCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### `dto/FormCreateDto.java`

```java
package com.yourcompany.formsapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

@Data
public class FormCreateDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Schema is required")
    private Map<String, Object> schema;
}
```

### `dto/SubmitRequestDto.java`

```java
package com.yourcompany.formsapi.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

@Data
public class SubmitRequestDto {

    @NotNull(message = "Data is required")
    private Map<String, Object> data;
}
```

### `dto/ValidationResultDto.java`

```java
package com.yourcompany.formsapi.dto;

import lombok.Data;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class ValidationResultDto {
    private boolean valid;
    private Map<String, List<String>> errors = new HashMap<>();

    public void addError(String fieldId, String error) {
        errors.computeIfAbsent(fieldId, k -> new java.util.ArrayList<>()).add(error);
    }

    public boolean isValid() {
        return errors.isEmpty();
    }
}
```

---

## Repository Interfaces

### `repository/FormRepository.java`

```java
package com.yourcompany.formsapi.repository;

import com.yourcompany.formsapi.entity.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FormRepository extends JpaRepository<Form, UUID> {

    List<Form> findByOwnerIdOrderByUpdatedAtDesc(UUID ownerId);

    @Query("SELECT f FROM Form f WHERE f.ownerId = :ownerId")
    List<Form> findAllByOwner(UUID ownerId);
}
```

### `repository/SubmissionRepository.java`

```java
package com.yourcompany.formsapi.repository;

import com.yourcompany.formsapi.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    List<Submission> findByFormIdOrderBySubmittedAtDesc(UUID formId);

    void deleteByFormId(UUID formId);
}
```

---

## Service Classes

### `service/FormService.java`

```java
package com.yourcompany.formsapi.service;

import com.yourcompany.formsapi.dto.*;
import com.yourcompany.formsapi.entity.Form;
import com.yourcompany.formsapi.exception.FormNotFoundException;
import com.yourcompany.formsapi.repository.FormRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FormService {

    private final FormRepository formRepository;
    private final ValidationService validationService;

    /**
     * Get all forms for a user
     */
    public List<FormSummaryDto> getFormsForUser(UUID userId) {
        return formRepository.findByOwnerIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    /**
     * Get single form by ID
     */
    public FormDto getForm(UUID id) {
        Form form = formRepository.findById(id)
                .orElseThrow(() -> new FormNotFoundException(id));
        return toDto(form);
    }

    /**
     * Create new form
     */
    @Transactional
    public FormDto createForm(FormCreateDto createDto, UUID ownerId) {
        // Validate schema structure
        validationService.validateSchema(createDto.getSchema());

        Form form = Form.builder()
                .title(createDto.getTitle())
                .schema(createDto.getSchema())
                .ownerId(ownerId)
                .build();

        Form saved = formRepository.save(form);
        return toDto(saved);
    }

    /**
     * Update existing form
     */
    @Transactional
    public FormDto updateForm(UUID id, FormUpdateDto updateDto, UUID ownerId) {
        Form form = formRepository.findById(id)
                .orElseThrow(() -> new FormNotFoundException(id));

        // Verify ownership
        if (!form.getOwnerId().equals(ownerId)) {
            throw new SecurityException("Not authorized to update this form");
        }

        if (updateDto.getTitle() != null) {
            form.setTitle(updateDto.getTitle());
        }

        if (updateDto.getSchema() != null) {
            validationService.validateSchema(updateDto.getSchema());
            form.setSchema(updateDto.getSchema());
        }

        Form saved = formRepository.save(form);
        return toDto(saved);
    }

    /**
     * Delete form
     */
    @Transactional
    public void deleteForm(UUID id, UUID ownerId) {
        Form form = formRepository.findById(id)
                .orElseThrow(() -> new FormNotFoundException(id));

        if (!form.getOwnerId().equals(ownerId)) {
            throw new SecurityException("Not authorized to delete this form");
        }

        formRepository.delete(form);
    }

    // ============ MAPPERS ============

    private FormDto toDto(Form form) {
        FormDto dto = new FormDto();
        dto.setId(form.getId().toString());
        dto.setTitle(form.getTitle());
        dto.setSchema(form.getSchema());
        dto.setCreatedAt(form.getCreatedAt());
        dto.setUpdatedAt(form.getUpdatedAt());
        return dto;
    }

    @SuppressWarnings("unchecked")
    private FormSummaryDto toSummaryDto(Form form) {
        FormSummaryDto dto = new FormSummaryDto();
        dto.setId(form.getId().toString());
        dto.setTitle(form.getTitle());
        dto.setCreatedAt(form.getCreatedAt());
        dto.setUpdatedAt(form.getUpdatedAt());

        // Extract field count from schema
        Map<String, Object> schema = form.getSchema();
        if (schema != null && schema.containsKey("fields")) {
            List<?> fields = (List<?>) schema.get("fields");
            dto.setFieldCount(fields != null ? fields.size() : 0);
        } else {
            dto.setFieldCount(0);
        }

        return dto;
    }
}
```

### `service/ValidationService.java`

```java
package com.yourcompany.formsapi.service;

import com.yourcompany.formsapi.dto.ValidationResultDto;
import com.yourcompany.formsapi.exception.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
@Slf4j
public class ValidationService {

    // Valid field types (all 14)
    private static final Set<String> VALID_TYPES = Set.of(
            "text", "textarea", "number", "email", "phone", "url",
            "select", "radio", "multiselect", "checkbox",
            "date", "time", "rating", "slider"
    );

    // Regex patterns
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$");
    private static final Pattern URL_PATTERN =
            Pattern.compile("^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$",
                    Pattern.CASE_INSENSITIVE);
    private static final Pattern TIME_PATTERN =
            Pattern.compile("^([01]?[0-9]|2[0-3]):[0-5][0-9]$");

    /**
     * Validate schema structure
     */
    @SuppressWarnings("unchecked")
    public void validateSchema(Map<String, Object> schema) {
        List<String> errors = new ArrayList<>();

        if (schema == null) {
            throw new ValidationException("Schema cannot be null");
        }

        // Check required fields
        if (!schema.containsKey("version")) {
            errors.add("'version' is required");
        }

        if (!schema.containsKey("title") || !(schema.get("title") instanceof String)) {
            errors.add("'title' must be a string");
        }

        if (!schema.containsKey("fields") || !(schema.get("fields") instanceof List)) {
            errors.add("'fields' must be an array");
        } else {
            List<Map<String, Object>> fields = (List<Map<String, Object>>) schema.get("fields");
            Set<String> fieldIds = new HashSet<>();
            Set<String> fieldNames = new HashSet<>();

            for (int i = 0; i < fields.size(); i++) {
                Map<String, Object> field = fields.get(i);
                int fieldNum = i + 1;

                // Check required field properties
                String id = (String) field.get("id");
                if (id == null || id.isBlank()) {
                    errors.add("Field " + fieldNum + ": 'id' is required");
                } else if (fieldIds.contains(id)) {
                    errors.add("Field " + fieldNum + ": duplicate id");
                } else {
                    fieldIds.add(id);
                }

                String type = (String) field.get("type");
                if (type == null || !VALID_TYPES.contains(type)) {
                    errors.add("Field " + fieldNum + ": invalid type");
                }

                String name = (String) field.get("name");
                if (name == null || name.isBlank()) {
                    errors.add("Field " + fieldNum + ": 'name' is required");
                } else if (fieldNames.contains(name)) {
                    errors.add("Field " + fieldNum + ": duplicate name");
                } else {
                    fieldNames.add(name);
                }

                String label = (String) field.get("label");
                if (label == null || label.isBlank()) {
                    errors.add("Field " + fieldNum + ": 'label' is required");
                }

                // Check options for select/radio/multiselect
                if (type != null && (type.equals("select") || type.equals("radio") || type.equals("multiselect"))) {
                    List<?> options = (List<?>) field.get("options");
                    if (options == null || options.isEmpty()) {
                        errors.add("Field " + fieldNum + ": options required for " + type);
                    }
                }
            }
        }

        if (!errors.isEmpty()) {
            throw new ValidationException("Schema validation failed: " + String.join(", ", errors));
        }
    }

    /**
     * Validate form submission data against schema
     */
    @SuppressWarnings("unchecked")
    public ValidationResultDto validateSubmission(Map<String, Object> values, Map<String, Object> schema) {
        ValidationResultDto result = new ValidationResultDto();

        List<Map<String, Object>> fields = (List<Map<String, Object>>) schema.get("fields");
        if (fields == null) {
            return result;
        }

        for (Map<String, Object> field : fields) {
            String fieldId = (String) field.get("id");
            String type = (String) field.get("type");
            Object value = values.get(fieldId);
            Boolean required = (Boolean) field.getOrDefault("required", false);

            List<String> fieldErrors = validateField(value, type, required, field);
            for (String error : fieldErrors) {
                result.addError(fieldId, error);
            }
        }

        return result;
    }

    /**
     * Validate a single field value
     */
    @SuppressWarnings("unchecked")
    private List<String> validateField(Object value, String type, boolean required, Map<String, Object> field) {
        List<String> errors = new ArrayList<>();

        // Check required
        if (required && !isValuePresent(value, type)) {
            errors.add("Ce champ est requis");
            return errors;
        }

        // Skip further validation if empty and not required
        if (!isValuePresent(value, type)) {
            return errors;
        }

        // Type-specific validation
        switch (type) {
            case "number" -> validateNumber(value, field, errors);
            case "email" -> validateEmail(value, errors);
            case "phone" -> validatePhone(value, errors);
            case "url" -> validateUrl(value, errors);
            case "date" -> validateDate(value, errors);
            case "time" -> validateTime(value, errors);
            case "select", "radio" -> validateSelect(value, field, errors);
            case "multiselect" -> validateMultiselect(value, field, errors);
            case "rating" -> validateRating(value, field, errors);
            case "slider" -> validateSlider(value, field, errors);
            case "text", "textarea" -> validateText(value, field, errors);
        }

        return errors;
    }

    private boolean isValuePresent(Object value, String type) {
        if (value == null) return false;

        if (type.equals("checkbox")) {
            return Boolean.TRUE.equals(value);
        }

        if (type.equals("multiselect")) {
            return value instanceof List && !((List<?>) value).isEmpty();
        }

        if (value instanceof String str) {
            return !str.trim().isEmpty();
        }

        if (value instanceof Number) {
            return true;
        }

        return true;
    }

    private void validateNumber(Object value, Map<String, Object> field, List<String> errors) {
        try {
            double numValue = ((Number) value).doubleValue();

            Number min = (Number) field.get("min");
            Number max = (Number) field.get("max");

            if (min != null && numValue < min.doubleValue()) {
                errors.add("Minimum: " + min);
            }

            if (max != null && numValue > max.doubleValue()) {
                errors.add("Maximum: " + max);
            }
        } catch (ClassCastException e) {
            errors.add("Nombre invalide");
        }
    }

    private void validateEmail(Object value, List<String> errors) {
        if (!EMAIL_PATTERN.matcher(String.valueOf(value)).matches()) {
            errors.add("Email invalide");
        }
    }

    private void validatePhone(Object value, List<String> errors) {
        String phone = String.valueOf(value);
        if (!PHONE_PATTERN.matcher(phone).matches() ||
            phone.replaceAll("\\D", "").length() < 6) {
            errors.add("Numéro de téléphone invalide");
        }
    }

    private void validateUrl(Object value, List<String> errors) {
        if (!URL_PATTERN.matcher(String.valueOf(value)).matches()) {
            errors.add("URL invalide");
        }
    }

    private void validateDate(Object value, List<String> errors) {
        try {
            java.time.LocalDate.parse(String.valueOf(value));
        } catch (Exception e) {
            errors.add("Date invalide");
        }
    }

    private void validateTime(Object value, List<String> errors) {
        if (!TIME_PATTERN.matcher(String.valueOf(value)).matches()) {
            errors.add("Format invalide (HH:MM)");
        }
    }

    @SuppressWarnings("unchecked")
    private void validateSelect(Object value, Map<String, Object> field, List<String> errors) {
        List<Map<String, Object>> options = (List<Map<String, Object>>) field.get("options");
        if (options == null) return;

        Set<String> validValues = new HashSet<>();
        for (Map<String, Object> opt : options) {
            validValues.add(String.valueOf(opt.get("value")));
        }

        if (!validValues.contains(String.valueOf(value))) {
            errors.add("Option invalide");
        }
    }

    @SuppressWarnings("unchecked")
    private void validateMultiselect(Object value, Map<String, Object> field, List<String> errors) {
        if (!(value instanceof List)) {
            errors.add("Sélection invalide");
            return;
        }

        List<Map<String, Object>> options = (List<Map<String, Object>>) field.get("options");
        if (options == null) return;

        Set<String> validValues = new HashSet<>();
        for (Map<String, Object> opt : options) {
            validValues.add(String.valueOf(opt.get("value")));
        }

        List<?> selectedValues = (List<?>) value;
        for (Object selected : selectedValues) {
            if (!validValues.contains(String.valueOf(selected))) {
                errors.add("Option(s) invalide(s)");
                return;
            }
        }
    }

    private void validateRating(Object value, Map<String, Object> field, List<String> errors) {
        try {
            int rating = ((Number) value).intValue();
            int maxRating = ((Number) field.getOrDefault("maxRating", 5)).intValue();

            if (rating < 1 || rating > maxRating) {
                errors.add("Notation entre 1 et " + maxRating);
            }
        } catch (ClassCastException e) {
            errors.add("Notation invalide");
        }
    }

    private void validateSlider(Object value, Map<String, Object> field, List<String> errors) {
        try {
            double numValue = ((Number) value).doubleValue();
            double min = ((Number) field.getOrDefault("min", 0)).doubleValue();
            double max = ((Number) field.getOrDefault("max", 100)).doubleValue();

            if (numValue < min) {
                errors.add("Minimum: " + (int) min);
            }
            if (numValue > max) {
                errors.add("Maximum: " + (int) max);
            }
        } catch (ClassCastException e) {
            errors.add("Valeur invalide");
        }
    }

    private void validateText(Object value, Map<String, Object> field, List<String> errors) {
        String strValue = String.valueOf(value);

        Number minLength = (Number) field.get("minLength");
        Number maxLength = (Number) field.get("maxLength");

        if (minLength != null && strValue.length() < minLength.intValue()) {
            errors.add("Min. " + minLength + " caractères");
        }

        if (maxLength != null && strValue.length() > maxLength.intValue()) {
            errors.add("Max. " + maxLength + " caractères");
        }
    }
}
```

---

## Controllers

### `controller/FormController.java`

```java
package com.yourcompany.formsapi.controller;

import com.yourcompany.formsapi.dto.*;
import com.yourcompany.formsapi.service.FormService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Configure properly in production
public class FormController {

    private final FormService formService;

    /**
     * GET /api/forms - List all forms for authenticated user
     */
    @GetMapping
    public ResponseEntity<List<FormSummaryDto>> getForms(
            @AuthenticationPrincipal UUID userId) {
        List<FormSummaryDto> forms = formService.getFormsForUser(userId);
        return ResponseEntity.ok(forms);
    }

    /**
     * GET /api/forms/{id} - Get form with full schema
     */
    @GetMapping("/{id}")
    public ResponseEntity<FormDto> getForm(@PathVariable UUID id) {
        FormDto form = formService.getForm(id);
        return ResponseEntity.ok(form);
    }

    /**
     * POST /api/forms - Create new form
     */
    @PostMapping
    public ResponseEntity<FormDto> createForm(
            @Valid @RequestBody FormCreateDto createDto,
            @AuthenticationPrincipal UUID userId) {
        FormDto form = formService.createForm(createDto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(form);
    }

    /**
     * PUT /api/forms/{id} - Update existing form
     */
    @PutMapping("/{id}")
    public ResponseEntity<FormDto> updateForm(
            @PathVariable UUID id,
            @Valid @RequestBody FormUpdateDto updateDto,
            @AuthenticationPrincipal UUID userId) {
        FormDto form = formService.updateForm(id, updateDto, userId);
        return ResponseEntity.ok(form);
    }

    /**
     * DELETE /api/forms/{id} - Delete form
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForm(
            @PathVariable UUID id,
            @AuthenticationPrincipal UUID userId) {
        formService.deleteForm(id, userId);
        return ResponseEntity.noContent().build();
    }
}
```

### `controller/SubmissionController.java`

```java
package com.yourcompany.formsapi.controller;

import com.yourcompany.formsapi.dto.*;
import com.yourcompany.formsapi.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forms/{formId}")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubmissionController {

    private final SubmissionService submissionService;

    /**
     * POST /api/forms/{formId}/submit - Submit form response
     */
    @PostMapping("/submit")
    public ResponseEntity<SubmissionDto> submitForm(
            @PathVariable UUID formId,
            @Valid @RequestBody SubmitRequestDto submitRequest) {
        SubmissionDto submission = submissionService.submitForm(formId, submitRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(submission);
    }

    /**
     * GET /api/forms/{formId}/submissions - List submissions
     */
    @GetMapping("/submissions")
    public ResponseEntity<List<SubmissionDto>> getSubmissions(@PathVariable UUID formId) {
        List<SubmissionDto> submissions = submissionService.getSubmissions(formId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * DELETE /api/forms/{formId}/submissions/{submissionId} - Delete submission
     */
    @DeleteMapping("/submissions/{submissionId}")
    public ResponseEntity<Void> deleteSubmission(
            @PathVariable UUID formId,
            @PathVariable UUID submissionId) {
        submissionService.deleteSubmission(formId, submissionId);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Database Schema (PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Forms table
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    version INTEGER DEFAULT 1,
    schema JSONB NOT NULL,
    owner_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    form_title VARCHAR(255),
    data JSONB NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_forms_owner ON forms(owner_id);
CREATE INDEX idx_forms_updated ON forms(updated_at DESC);
CREATE INDEX idx_submissions_form ON submissions(form_id);
CREATE INDEX idx_submissions_date ON submissions(submitted_at DESC);

-- GIN index for JSONB queries (optional, for searching within schemas)
CREATE INDEX idx_forms_schema ON forms USING GIN (schema);
CREATE INDEX idx_submissions_data ON submissions USING GIN (data);
```

---

## Application Properties

### `application.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/formsdb
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

  jackson:
    serialization:
      write-dates-as-timestamps: false
    default-property-inclusion: non_null

server:
  port: 8080

# JWT Configuration
jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-here-minimum-32-chars}
  expiration: 86400000  # 24 hours

# CORS Configuration
cors:
  allowed-origins: http://localhost:4200
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
```

---

## API Response Examples

### Create Form Request

```json
POST /api/forms
Content-Type: application/json

{
  "title": "Contact Form",
  "schema": {
    "version": 1,
    "title": "Contact Form",
    "fields": [
      {
        "id": "f_1704067200000_1",
        "type": "text",
        "name": "full_name",
        "label": "Full Name",
        "required": true,
        "placeholder": "Enter your name"
      },
      {
        "id": "f_1704067200000_2",
        "type": "email",
        "name": "email",
        "label": "Email",
        "required": true
      }
    ]
  }
}
```

### Submit Form Request

```json
POST /api/forms/{formId}/submit
Content-Type: application/json

{
  "data": {
    "f_1704067200000_1": "John Doe",
    "f_1704067200000_2": "john@example.com"
  }
}
```

### Validation Error Response

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "valid": false,
  "errors": {
    "f_1704067200000_1": ["Ce champ est requis"],
    "f_1704067200000_2": ["Email invalide"]
  }
}
```

---

*Document generated by Winston (Architect Agent) for Spring Boot 3.x implementation.*
