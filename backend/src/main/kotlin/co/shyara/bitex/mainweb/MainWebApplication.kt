package co.shyara.bitex.mainweb

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MainWebApplication

fun main(args: Array<String>) {
    runApplication<MainWebApplication>(*args)
}
