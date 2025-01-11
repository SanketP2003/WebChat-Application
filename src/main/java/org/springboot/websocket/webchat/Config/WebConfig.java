package org.springboot.websocket.webchat.Config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/").allowedOriginPatterns("*")// Apply to all endpoints
                //.allowedOrigins("http://localhost:5500","http://192.168.255.183:5500","http://172.28.240.1:5500","http://127.0.0.1:5501","https://ragvaabi3dguweaq4j8jyq.on.drv.tw","http://192.168.255.205:5500")// Allow specific origins
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow credentials (cookies)
    }
}//.allowedOrigins("/")
//http://localhost:5500","http://192.168.255.183:5500","http://172.28.240.1:5500","http://127.0.0.1:5501","https://ragvaabi3dguweaq4j8jyq.on.drv.tw","http://192.168.255.205:5500