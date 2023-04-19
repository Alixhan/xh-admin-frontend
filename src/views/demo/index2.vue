<template>
  <div>
    卡萨丁房间号看手机电话费空间水电费
    <el-steps v-for="item in 20" :key="item" :active="1" finish-status="success">
      <el-step title="Step 1" />
      <el-step title="Step 2" />
      <el-step title="Step 3" />
    </el-steps>
  </div>
</template>
<script setup name="FGGGG">
import { ref, toRefs } from 'vue'
import { getKhList } from '@/api/test'
import { useRouter } from 'vue-router'

const router = useRouter()

const customers = ref({ tagGroupList: [] })

const saveLoading = ref(false)
const formData = ref({
  name: '李华',
  pp: ['1', '2', '3', '4'],
})

const fields = ref([
  {
    prop: 'name',
    label: '用户名',
    showWordLimit: true,
    comment: '这是一个描述的提示文字哈啦啦防守打法水电费水电费水电费水电费水电费水电费啦啦啦~~',
    rule: [
      { required: true, message: '用户名必填' },
      { maxlength: 10, message: '用户名最长10个字符' },
    ],
    onChange
  },

  { prop: 'button', label: 'button', type: 'button', onChange },
  { prop: 'checkbox', label: 'checkbox', type: 'checkbox', onChange },
  { prop: 'color', label: 'color', type: 'color', onChange },
  { prop: 'date', label: 'date', type: 'date', onChange },
  { prop: 'datetime', label: 'datetime', type: 'datetime', onChange },
  { prop: 'email', label: 'email', type: 'email', onChange },
  { prop: 'file', label: 'file', type: 'file', onChange },
  { prop: 'hidden', label: 'hidden', type: 'hidden', onChange },
  { prop: 'image', label: 'image', type: 'image', src: 'https://image.baidu.com/search/detail?ct=503316480&z=undefined&tn=baiduimagedetail&ipn=d&word=js%E6%89%93%E5%BC%80%E6%B5%8F%E8%A7%88%E5%99%A8%E8%87%AA%E5%B8%A6%E7%9A%84input%E6%97%B6%E9%97%B4%E9%80%89%E6%8B%A9%E5%99%A8&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=undefined&hd=undefined&latest=undefined&copyright=undefined&cs=2793196912,331732413&os=2637973649,1443218707&simid=2793196912,331732413&pn=30&rn=1&di=46137345&ln=1928&fr=&fmq=1657787678018_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=0&ist=&jit=&bdtype=11&spn=0&pi=0&gsm=0&objurl=https%3A%2F%2Fgimg2.baidu.com%2Fimage_search%2Fsrc%3Dhttp%253A%252F%252Fs4.51cto.com%252Fimages%252Fblog%252F202206%252F28143350_62baa0ce508aa42119.png%253Fx-oss-process%253Dimage%252Fwatermark%252Csize_16%252Ctext_QDUxQ1RP5Y2a5a6i%252Ccolor_FFFFFF%252Ct_30%252Cg_se%252Cx_10%252Cy_10%252Cshadow_20%252Ctype_ZmFuZ3poZW5naGVpdGk%253D%26refer%3Dhttp%253A%252F%252Fs4.51cto.com%26app%3D2002%26size%3Df9999%2C10000%26q%3Da80%26n%3D0%26g%3D0n%26fmt%3Dauto%3Fsec%3D1660379680%26t%3Dd21d462e8b0f01c81977fda02cbeedc1&rpstart=0&rpnum=0&adpicid=0&nojc=undefined&dyTabStr=MCw2LDQsNSwzLDEsNyw4LDIsOQ%3D%3D', onChange },
  { prop: 'month', label: 'month', type: 'month', onChange },
  { prop: 'number', label: 'number', type: 'number', onChange },
  { prop: 'password', label: 'password', type: 'password', onChange },
  { prop: 'radio', label: 'radio', type: 'radio', onChange },
  { prop: 'range', label: 'range', type: 'range', onChange },
  { prop: 'reset', label: 'reset', type: 'reset', onChange },
  { prop: 'search', label: 'search', type: 'search', onChange },
  { prop: 'submit', label: 'submit', type: 'submit', onChange },
  { prop: 'tel', label: 'tel', type: 'tel', onChange },
  { prop: 'text', label: 'text', type: 'text', onChange },
  { prop: 'time', label: 'time', type: 'time', onChange },
  { prop: 'url', label: 'url', type: 'url', onChange },
  { prop: 'week', label: 'week', type: 'week', onChange },
])
function onChange (e) {
}
function getKhlb () {
  getKhList().then(res => {
    customers.value = res.data
  })
}

</script>
