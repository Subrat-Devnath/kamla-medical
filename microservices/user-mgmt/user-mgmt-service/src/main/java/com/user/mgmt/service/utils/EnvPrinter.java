package com.user.mgmt.service.utils;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class EnvPrinter implements CommandLineRunner {

	private final Environment environment;

	public EnvPrinter(Environment environment) {
		this.environment = environment;
	}

	@Override
	public void run(String... args) {
		System.out.println("===== Printing All Environment Variables =====");

		if (environment instanceof ConfigurableEnvironment configurableEnv) {
		//	configurableEnv.getSystemEnvironment().forEach((key, value) -> System.out.println(key + "=" + value));
		}
	}
}