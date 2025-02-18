package com.Intraintech.backend.security.config;



import com.Intraintech.backend.security.jwt.AuthEntryPointJwt;
import com.Intraintech.backend.security.jwt.AuthTokenFilter;
import com.Intraintech.backend.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    @Value("${FRONT_END_URL}")
    private String frontEndUrl;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authTokenJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return  authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(e-> e.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.addAllowedOrigin("http://157.173.222.234:3000");
                    config.addAllowedOrigin("https://interviewbot.intraintech.com");
                    config.addAllowedOrigin("http://interviewbot.intraintech.com:3000");
                    config.addAllowedOrigin("http://157.173.222.234:5040");
                    config.addAllowedOrigin("http://localhost:3000"); // Your frontend URL
                    config.addAllowedOrigin("http://127.0.0.1:5000");
                    config.addAllowedOrigin(frontEndUrl);
                    config.addAllowedMethod("*"); // Allow all methods/api/question-answers
                    config.addAllowedHeader("*"); // Allow all headers
                    config.setAllowCredentials(true); // Allow credentials (e.g., cookies)
                    return config;
                }))
                .exceptionHandling(e->e.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(e -> e.requestMatchers("/api/auth/**", "/api/test/**","/welcome","/api/question-answers/add/**","/api/tutors/**").permitAll()
                        .anyRequest().authenticated());
    

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authTokenJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Configuration
    public class WebConfig implements WebMvcConfigurer {

        @Value("${FRONT_END_URL}")
        private String frontEndUrl;

        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("http://157.173.222.234:3000","http://157.173.222.234:5040","http://interviewbot.intraintech.com:3000","http://interviewbot.intraintech.com")
                    .allowedOrigins("http://localhost:3000","http://127.0.0.1:5000",frontEndUrl) // Your frontend URL
                    .allowedMethods("GET", "POST", "PUT", "DELETE");
        }
    }

}
