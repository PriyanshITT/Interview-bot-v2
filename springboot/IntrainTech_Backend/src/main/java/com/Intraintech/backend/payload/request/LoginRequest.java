package com.Intraintech.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {


    @NotBlank
    @Size(max=50)
    private String username;

    @NotBlank
    private String password;
    public @NotBlank @Size(max = 50) String getUsername() {
        return username;
    }

    public @NotBlank String getPassword() {
        return password;
    }


}
