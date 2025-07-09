<script setup>
import { reactive } from 'vue'
import { login } from '@/api/login'
import { useAllDataStore } from '@/stores'
import { useRouter } from 'vue-router'

const formModel = reactive({
  username: '',
  password: ''
})

const router = useRouter()
const state = useAllDataStore()
// 登录
const handleLogin = async () => {
  const { menuList, token, userInfo } = await login(formModel)
  state.updateInfo(menuList, token, userInfo)
  state.addMenu(router)
  router.push('/home')
}
</script>

<template>
  <div class="login">
    <el-form :model="formModel" class="login-form">
      <h3>欢迎登录</h3>
      <el-form-item>
        <el-input v-model="formModel.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-input
          show-password
          v-model="formModel.password"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-row type="flex" justify="center">
        <el-form-item>
          <el-button @click="handleLogin" type="primary">登录</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url('../assets/images/background.png') no-repeat center/cover;
  .login-form {
    width: 400px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    box-shadow: 0 0 25px #cacaca;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    h3 {
      text-align: center;
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 20px;
      color: #505450;
    }
  }
}
</style>
