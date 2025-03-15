package com.Intraintech.backend.Controller;

import com.Intraintech.backend.security.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestParam String to,
                            @RequestParam String subject,
                            @RequestParam String text,
                            @RequestParam String user,
                            @RequestParam String usertext) {
        emailService.sendSimpleEmail(to, subject, text);
        emailService.sendSimpleEmail(user,"Booked Successfully",usertext);
        return "Email sent successfully";
    }
}