<template>
  <div>
    <!-- 商品规格 添加 -->
    <el-dialog
      :title="info.isAdd ? '规格添加' : '规格修改'"
      :visible.sync="info.isshow"
      @closed="cancel"
    >
      <el-form :model="user">
        -----{{ user }}
        <div>新增规格属性: {{ attrsArr }}</div>

        <el-form-item label="规格名称" label-width="100px">
          <el-input v-model="user.specsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in attrsArr"
          :key="index"
          label="规格属性"
          label-width="100px"
        >
          <div class="iptBtn">
            <el-input
              class="ipt"
              v-model="item.value"
              autocomplete="off"
            ></el-input>
            <el-button
              class="btn"
              type="primary"
              v-if="index == 0"
              @click="addAttrs"
              >新增规格属性</el-button
            >
            <el-button type="danger" v-else @click="delAddAttrs(index)"
              >删除</el-button
            >
          </div>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="100px">
          <!-- active-value 1 正常;inactive-value 2 禁用;number类型 -->
          <el-switch
            v-model="user.status"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.isAdd" @click="add"
          >添 加</el-button
        >
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { reqSpecsAdd, reqSpecsEdit, reqSpecsUpdate } from "../../../utils/http";
import { successAlert } from "../../../utils/myAlert";

export default {
  props: ["info"],

  data() {
    return {
      //  初始化user
      user: {
        specsname: "", //商品规格名称
        attrs: "[]", //商品规格属性值 "['红色‘，’黄色‘]"
        status: 1, //状态  1正常2禁用 number
      },
      // 初始化新增规格属性的值
      attrsArr: [
        { value: "" }, //输入框的值value
      ],
    };
  },
  computed: {
    ...mapGetters({}),
  },

  methods: {
    ...mapActions({
      reqList: "specs/reqList",
      reqTotal: "specs/reqTotal",
    }),
    // 点击取消按钮 添加弹框消失
    cancel() {
      // 如果点的是"编辑"里的取消按钮,则清空数据;
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    //清空数据
    empty() {
      this.user = {
        specsname: "",
        attrs: "[]",
        status: 1,
      };

      // 规格属性数据 清空
      this.attrsArr = [
        { value: "" }, //输入框的值value
      ];
    },
    // 点击"新增规格属性"按钮
    addAttrs() {
      this.attrsArr.push({ value: "" });
    },
    // 点了"规格属性"后的"删除"按钮
    delAddAttrs(index) {
      this.attrsArr.splice(index, 1);
    },
    // 封装的add页面数据验证函数
    checkProps() {
      return new Promise((resolve) => {
        if (this.user.specsname === "") {
          erroralert("规格名称不能为空");
          return;
        }
        if (this.attrsArr.some((item) => item.value === "")) {
          erroralert("请输入所有的规格属性");
          return;
        }
        resolve();
      });
    },
    //  添加了
    add() {
      this.checkProps().then(() => {
        // 添加按钮之前,map遍历 赋值; 拿到的是数组, 再转为字符串数组
        this.user.attrs = JSON.stringify(
          this.attrsArr.map((item) => item.value)
        );

        reqSpecsAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            //   弹成功的消息
            successAlert(res.data.msg);
            //   清空数据
            this.empty();
            //   add页面隐藏
            this.cancel();
            //通知父组件,刷新页面,重新获取总数
            this.reqList();
            this.reqTotal();
          }
        });
      });
    },
    // 编辑操作,接收父组件传过来的getOne
    getOne(id) {
      reqSpecsEdit({ id: id }).then((res) => {
        if (res.data.code == 200) {
          // 赋值
          this.user = res.data.list[0];
          // 规格属性 先将字符串数组转成数组
          this.user.attrs = JSON.parse(this.user.attrs);
          // 再将数组 遍历到attrsArr展示
          this.attrsArr = this.user.attrs.map((item) => ({ value: item }));
        }
      });
    },
    // 修改按钮
    update() {

      this.checkProps().then(() => {
        // 请求之前,处理attrs数据
        this.user.attrs = JSON.stringify(this.attrsArr.map(item => item.value));

        reqSpecsUpdate(this.user).then((res) => {
          // 弹成功消息
          successAlert(res.data.msg);
          // 页面隐藏
          this.cancel();
          // 数据清空
          this.empty();
          // 刷新页面
          this.reqList();
        });
      });
    },
  },
};
</script>

<style scoped>
.iptBtn {
  display: flex;
}
.iptBtn .ipt {
  flex: 1;
}
.iptBtn .btn {
  width: 120px;
}
</style>