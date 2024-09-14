plugins {
    kotlin("jvm") version "2.0.10"
    kotlin("plugin.serialization") version "2.0.10"
}

group = "com.refactorized"
version = "1.0-RELEASE"

repositories {
    mavenCentral()
}

dependencies {
    // Ktor dependencies
    implementation("io.ktor:ktor-server-core:2.3.12") // Core framework
    implementation("io.ktor:ktor-server-netty:2.3.12") // Netty HTTP server engine
    implementation("io.ktor:ktor-server-content-negotiation:2.3.12") // Content negotiation middleware
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.12") // JSON support via kotlinx

    // Logging
    implementation("ch.qos.logback:logback-classic:1.2.10") // Logging framework

    // Ktor client dependencies
    implementation("io.ktor:ktor-client-core:2.3.12")  // Core client library
    implementation("io.ktor:ktor-client-cio:2.3.12")   // CIO engine for HTTP communication
    implementation("io.ktor:ktor-client-content-negotiation:2.3.12") // Content negotiation for client

    // Serialization support
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0") // JSON serialization module

    // Testing
    testImplementation(kotlin("test"))
}

tasks.named<Test>("test") {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17)) // Setting the JDK version to 17
    }
}
