## 测试 Express 项目中开启 https 服务

使用 `openssl` 生成自签名证书(免费，本地测试使用)。

生成 `private key` 和 `csr`：

```bash
openssl req -new -newkey rsa:2048 -nodes -out mydomain.csr -keyout private.key
```

利用上一步生成的 `private.key` 和 `mydomain.csr` 生成自签名证书：

```bash
openssl x509 -req -days 365 -in mydomain.csr -signkey private.key -out mydomain.crt
```

