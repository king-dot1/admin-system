<script setup>
import { ref, reactive, nextTick } from 'vue'
import { getUserData, deleteUser, createUser, updateUser } from '@/api/user'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'

const tableData = ref([])

const tableLabel = reactive([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'sexLabel', label: '性别' },
  { prop: 'birth', label: '出生日期', width: 200 },
  { prop: 'addr', label: '地址', width: 400 }
])
// 搜索条件
const formModel = reactive({
  name: ''
})
// 请求传参
const params = reactive({
  name: '',
  page: 1,
  limt: 10,
  total: 0,
  ces: '测"aa"试'
})
const getUserList = async () => {
  const { list, count } = await getUserData(params)
  params.total = count
  tableData.value = list.map((item) => ({
    ...item,
    sexLabel: item.sex === 1 ? '男' : '女'
  }))
}
getUserList()

// 搜索点击事件
const handleSearch = () => {
  params.name = formModel.name
  getUserList()
}

// 分页点击事件
const handleChange = (val) => {
  params.page = val
  getUserList()
}

// 删除
const handleDelete = (id) => {
  ElMessageBox.confirm('确定删除该用户吗？', '删除用户', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteUser(id)
      getUserList()

      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
    .catch(() => {})
}

const dialogVisible = ref(false)
const action = ref('add') // 操作类型
const formUser = ref({})
const userForm = ref(null)

//表单校验规则
const rules = reactive({
  name: [{ required: true, message: '姓名是必填项', trigger: 'blur' }],
  age: [
    { required: true, message: '年龄是必填项', trigger: 'blur' },
    { type: 'number', message: '年龄必须是数字' }
  ],
  sex: [{ required: true, message: '性别是必选项', trigger: 'change' }],
  birth: [{ required: true, message: '出生日期是必选项' }],
  addr: [{ required: true, message: '地址是必填项' }]
})

// 新增
const handleAdd = () => {
  dialogVisible.value = true
  action.value = 'add'
}

// 处理日期格式
const formatDate = (date) => {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const onSubmit = async () => {
  // 预校验
  await userForm.value.validate()
  formUser.value.birth = formatDate(formUser.value.birth)
  formUser.value.sex = parseInt(formUser.value.sex)
  // 判断操作类型
  if (action.value === 'add') {
    await createUser(formUser.value)
  } else {
    await updateUser(formUser.value)
  }
  handleClose()
  ElMessage({
    type: 'success',
    message: action.value === 'add' ? '新增成功' : '更新成功'
  })
  // 刷新列表
  getUserList()
}
// 编辑
const handleEdit = (row) => {
  dialogVisible.value = true
  action.value = 'edit'
  // DOM更新后执行赋值
  nextTick(() => {
    formUser.value = { ...row, sex: String(row.sex) }
  })
}
const handleCancel = () => {
  handleClose()
}
// 关闭前的回调
const handleClose = () => {
  // 重置表单
  userForm.value.resetFields()
  dialogVisible.value = false
}
</script>

<template>
  <div class="user">
    <div class="user-header">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-form :inline="true" :model="formModel">
        <el-form-item label="请输入">
          <el-input
            placeholder="请输入用户名"
            v-model="formModel.name"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : 125"
        />

        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row class="pager-row" type="flex" justify="end">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="params.total"
          @current-change="handleChange"
          size="small"
        />
      </el-row>

      <!-- 弹层 -->
      <el-dialog
        v-model="dialogVisible"
        :title="action == 'add' ? '新增用户' : '编辑用户'"
        width="35%"
        :before-close="handleClose"
      >
        <!--需要注意的是设置了:inline="true"，
        会对el-select的样式造成影响，通过给他设置一个class=select-clearn
        在css进行处理-->
        <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="formUser.name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄" prop="age">
                <el-input
                  v-model.number="formUser.age"
                  placeholder="请输入年龄"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item class="select-clearn" label="性别" prop="sex">
                <el-select v-model="formUser.sex" placeholder="请选择">
                  <el-option label="男" value="1" />
                  <el-option label="女" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生日期" prop="birth">
                <el-date-picker
                  v-model="formUser.birth"
                  type="date"
                  placeholder="请输入"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="地址" prop="addr">
              <el-input v-model="formUser.addr" placeholder="请输入地址" />
            </el-form-item>
          </el-row>
          <el-row style="justify-content: flex-end">
            <el-form-item>
              <el-button type="primary" @click="handleCancel">取消</el-button>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="less">
.user {
  .user-header {
    display: flex;
    justify-content: space-between;
  }
  .table {
    .pager-row {
      background-color: #fff;
      padding: 7px;
    }
    .select-clearn {
      display: flex;
    }
  }
}
</style>
