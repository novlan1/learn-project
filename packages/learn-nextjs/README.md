## learn-nextjs

### redis

##### centos 安装

更新安装源来安装最新得包

```
sudo yum install epel-release
sudo yum update
```

安装 redis

```
sudo yum install redis
```

后台启动 redis

```
sudo systemctl start redis
```

设置开机启动 redis

```
sudo systemctl enable redis
```
