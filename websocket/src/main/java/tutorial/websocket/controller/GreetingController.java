package tutorial.websocket.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import tutorial.websocket.message.Greeting;
import tutorial.websocket.message.HelloMessage;

@Controller
public class GreetingController {

    /**
     * STOMP 메시지는 컨트롤러 클래스로 라우팅된다.
     *
     * 반환값 Greeting은 /topic/greetings의 subscribers에게 broadcast
     *
     * @param message
     * @return
     * @throws Exception
     */
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000);
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

}
