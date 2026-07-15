package com.openai.client;

import org.springframework.stereotype.Service;
import org.springframework.cloud.openfeign.FeignClient;

@Service
@FeignClient(contextId = "openaiClient", name = "openai", url = "${openai.url}", path = "${openai.contextPath}")
public interface OpenAIClient {

}
