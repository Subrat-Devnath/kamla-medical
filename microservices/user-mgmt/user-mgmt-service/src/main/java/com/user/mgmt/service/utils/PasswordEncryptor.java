package com.user.mgmt.service.utils;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import com.security.config.service.impl.WebSecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PasswordEncryptor {

	private static final int SALT_ROUND_LIMIT = 10;

	@Value("${app.master-salt}")
	private String masterSalt;

	public String encrypt(String inputPass, String salt) throws NoSuchAlgorithmException {
		String password = encryptWithSHA256AndSalt(inputPass, salt);
		return encryptWithSHA256AndSalt(password, masterSalt);
	}

	public String encryptWithSHA256AndSalt(String inputText, String salt) throws NoSuchAlgorithmException {
		MessageDigest mDigest = MessageDigest.getInstance("SHA-256");
		StringBuilder passwordHash = new StringBuilder();
		StringBuilder saltpass = new StringBuilder(inputText);
		int i = 1;
		do {
			saltpass.append(salt);
			i++;
		} while (i <= SALT_ROUND_LIMIT);

		mDigest.update(salt.getBytes());
		byte[] result = mDigest.digest(inputText.getBytes());

		for (byte eachByte : result) {
			passwordHash.append(String.valueOf(eachByte));
		}

		return String.valueOf(passwordHash);
	}

}
