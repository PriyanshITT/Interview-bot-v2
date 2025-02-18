package com.Intraintech.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.security.SecureRandom;


public class LeaderboardResponse {
    private String username;
    private String name;

    public String getName() {
        return name;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    private String country;

    public void setName(String name) {
        this.name = name;
    }

    public LeaderboardResponse(String username, int marks, String name,String country) {
        this.username = username;
        this.marks = marks;
        this.name =name;
        this.country=country;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getMarks() {
        return marks;
    }

    public void setMarks(int marks) {
        this.marks = marks;
    }

    private int marks;
}
