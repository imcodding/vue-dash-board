package com.dash.common.encrypt;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


public class ShaEncrypt {

    /**
     * The enum Sha algorithm type.
     */
    public enum ShaAlgorithmType {
        /**
         * MD2 algorithm type.
         */
        MD2("MD2"),
        /**
         * MD5 algorithm type.
         */
        MD5("MD5"),
        /**
         * Sha 1 sha algorithm type.
         */
        SHA1("SHA-1"),
        /**
         * Sha 224 sha algorithm type.
         */
        SHA224("SHA-224"),
        /**
         * Sha 256 sha algorithm type.
         */
        SHA256("SHA-256"),
        /**
         * Sha 384 sha algorithm type.
         */
        SHA384("SHA-384"),
        /**
         * Sha 512 sha algorithm type.
         */
        SHA512("SHA-512");

        private final String key;

        private ShaAlgorithmType(String key) {
            this.key = key;
        }

        /**
         * Gets key.
         *
         * @return the key
         */
        public String getKey() {
            return key;
        }
    }

    /**
     * SHA, salt 암호화.
     *
     * @param text 평문
     * @param salt the salt
     * @return sha string
     * @throws NoSuchAlgorithmException the no such algorithm exception
     */
    public String encryptWithSalt(ShaAlgorithmType shaAlgorithmType, String text, byte[] salt)
            throws NoSuchAlgorithmException {
        byte[] textBytes = text.getBytes(StandardCharsets.UTF_8);
        byte[] bytes = new byte[textBytes.length + salt.length];
        System.arraycopy(textBytes, 0, bytes, 0, textBytes.length);
        System.arraycopy(salt, 0, bytes, textBytes.length, salt.length);

        return encryptSHAFormBytes(shaAlgorithmType, bytes);
    }

    /**
     * SHA 암호화.
     *
     * @param text 평문
     * @return sha string
     * @throws NoSuchAlgorithmException the no such algorithm exception
     */
    public String encryptSHA(ShaAlgorithmType shaAlgorithmType, String text)
            throws NoSuchAlgorithmException {
        return encryptSHAFormBytes(shaAlgorithmType, text.getBytes(StandardCharsets.UTF_8));
    }
    /**
     * SHA 암호화, with byteArray.
     * @param dataBytes 평문 bytes
     * @return sha string
     */
    private String encryptSHAFormBytes(ShaAlgorithmType shaAlgorithmType, byte[] dataBytes)
            throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance(shaAlgorithmType.getKey());
        md.update(dataBytes);
        byte[] byteData = md.digest();

        StringBuilder sb = new StringBuilder();
        for(byte byteValue : byteData) {
            sb.append(Integer.toString((byteValue & 0xFF) + 256, 16).substring(1));
        }
        return sb.toString();
    }
}
