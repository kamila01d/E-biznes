package com.refactored.app
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

fun main() {
    embeddedServer(Netty, port = 8080) {
        initModule()
    }.start(wait = true)
}

fun Application.initModule() {
    configureSerialization()

    val httpClient = createHttpClient()

    routing {
        post("/webhook/notify") {
            val incomingMessage = call.receive<WebhookPayload>()
            val outcome = dispatchToWebhook(httpClient, incomingMessage.content)
            call.respondText("Notification result: $outcome")
        }
    }
}

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json(Json { prettyPrint = true; isLenient = true })
    }
}

fun createHttpClient(): HttpClient {
    return HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { prettyPrint = true; isLenient = true })
        }
    }
}

@Serializable
data class WebhookPayload(val content: String)

suspend fun dispatchToWebhook(client: HttpClient, content: String): String {
    val webhookUrl = "" // Set the actual webhook URL

    val response: HttpResponse = client.post(webhookUrl) {
        contentType(ContentType.Application.Json)
        setBody(WebhookPayload(content = content))
    }

    return if (response.status.isSuccess()) {
        "Success!"
    } else {
        "Error: ${response.status}"
    }
}
