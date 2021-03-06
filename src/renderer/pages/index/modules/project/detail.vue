<template>
  <div class="project-detail">
    <div class="project-detail__head clearfix">
      <div class="project-detail__head-back ui-fl-l"><i @click="handleBackProjectList" class="el-icon-arrow-left"></i></div>
      <strong class="project-detail__head-title ui-fl-l">
        {{project.name || ''}}&nbsp;
        <el-tooltip class="item" effect="dark" :content="project.path || ''" placement="right">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </strong>
      <div class="ui-fl-r">
        <el-button @click="handleProjectSetting" type="text" icon="el-icon-fa-wrench" size="mini">配置</el-button>
        <el-button @click="handleInstallDeps" type="text" icon="el-icon-fa-linode" size="mini">安装依赖</el-button>
        <el-button @click="handleOpenEditor" type="text" icon="el-icon-fa-code" size="mini">编辑器</el-button>
        <!-- <el-button @click="handleOpenTerminal" type="text" icon="el-icon-fa-terminal" size="mini">终端</el-button> -->
        <el-button @click="handleOpenFolder" type="text" icon="el-icon-fa-folder-open-o" size="mini">文件夹</el-button>
      </div>
    </div>
    <div class="project-detail__command-wrap">
      <div class="project-detail__command">
        <el-button
          v-for="(item, index) in commands"
          :key="index"
          @click="handleRunCommand(item)"
          type="text"
          size="mini"
          :class="[item.running ? 'command-running' : '']"
          :icon="item.running ? 'el-icon-fa-stop-circle-o' : 'el-icon-fa-play-circle'">{{item.name}}</el-button>
      </div>
    </div>
    <div class="project-detail__body">
      <terminal
        ref="terminal"
        :text="xtermText"
        :project="project"
        @data="handleTerminalData"
        @inited="handleTerminalInited">
      </terminal>
    </div>
    <el-dialog
      class="project-detail__setting"
      title="项目配置"
      fullscreen
      :visible.sync="projectSettingDialogVisible">
      <div>
        <el-tabs>
          <el-tab-pane label="命令配置">
            <el-table
              :data="commands"
              border
              stripe
              size="mini"
              style="width: 100%">
              <el-table-column prop="key" label="key" width="140"></el-table-column>
              <el-table-column prop="name" label="名称" width="180"></el-table-column>
              <el-table-column prop="command" label="命令"></el-table-column>
            </el-table>
            <!-- <div class="ui-pt-14 ui-ta-r">
              <el-button icon="el-icon-fa-refresh" size="mini">同步</el-button>
              <el-button type="primary" icon="el-icon-fa-floppy-o" size="mini">保存</el-button>
            </div> -->
          </el-tab-pane>
          <el-tab-pane label="依赖管理">
            <el-table
              :data="dependencies"
              border
              stripe
              size="mini"
              style="width: 100%">
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="version" label="版本"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import * as helper from '@/util/helper';
import Terminal from '@/components/terminal.vue';

export default {
  data() {
    return {
      session: null,
      project: {},
      projectSettingDialogVisible: false
    };
  },
  components: {
    Terminal
  },
  computed: mapGetters({
    commands: 'project/commands',
    dependencies: 'project/dependencies',
    xtermText: 'project/xtermText'
  }),
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      const pathname = decodeURIComponent(this.$route.query.path);
      // 查询项目
      const project = await this.$store.dispatch('project/queryProject', pathname);
      // 初始化项目
      await this.$store.dispatch('project/initProject', project);
      // 初始化终端
      const session = await this.$store.dispatch('project/initSession', {
        cwd: project.path
      });
      session.on('session:data', (data) => {
        if (this.$refs.terminal && this.$refs.terminal.xterm) {
          // 初始化成功，需要重新初始化项目
          if (/初始化([\w\W]+)?模板完成/.test(data)) {
            this.$store.dispatch('project/initProject', project)
          } else {
            this.$refs.terminal.xterm.write(data);
          }
        }
      });
      this.session = session;
      this.project = project || {};
    },
    handleTerminalData(data) {
      this.session.write(data);
    },
    handleTerminalInited(term) {
      if (this.$route.query.init) {
        const template = this.project.template || {};
        // jfet init -t 'https://npm.taobao.org' -f
        const command = [`jfet init -t ${template.url}`];
        // 清空目录
        if (template.force) {
          command.push('-f');
        }
        this.session.writeln(command.join(' '));
      }
    },
    handleProjectSetting() {
      this.projectSettingDialogVisible = true;
    },
    handleOpenEditor() {
      helper.openEditor(this.project.path).then(this.onFulfilled);
    },
    handleOpenTerminal() {
      helper.openTerminal(this.project.path).then(this.onFulfilled);
    },
    handleOpenFolder() {
      helper.openFolder(this.project.path);
    },
    handleInstallDeps() {
      this.session.writeln('npm i');
    },
    handleRunCommand(item) {
      if (item.running) {
        this.$store.dispatch('project/stopCommand', {
          cwd: this.project.path,
          command: item.command
        });
      } else {
        this.$store.dispatch('project/startCommand', {
          cwd: this.project.path,
          command: item.command
        }).then((session) => {
          session.on('session:data', (data) => {
            if (this.$refs.terminal && this.$refs.terminal.xterm) {
              this.$refs.terminal.xterm.write(data);
            }
          });
          session.writeln(`npm run ${item.key}`);
        });
      }
    },
    onFulfilled(result) {
      if (!result.success) {
        this.$notify.error({
          title: '错误',
          message: result.message
        });
      }
    },
    handleBackProjectList() {
      this.$router.push({ path: '/project/index' });
    }
  }
}
</script>
<style lang="scss" scoped>
.command-running {
  color: #f56c6c;
}
.project-detail__head {
  height: 50px;
  box-sizing: border-box;
  line-height: 50px;
  background-color: #fcfcfc;
  border-bottom: .5px solid #e0e0e0;
  font-size: 12px;
  color: #666;
  text-align: right;
  padding-right: 20px;
}
.project-detail__head-back {
  padding-left: 12px;
  padding-right: 12px;
  font-size: 16px;
  i {
    cursor: pointer;
    &:hover {
      color: #409EFF;
    }
  }
}
.project-detail__head-title {
  font-size: 14px;
  font-weight: bold;
}
.project-detail__command-wrap {
  position: relative;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  overflow-x: scroll;
  height: 40px;
  background-color: #fcfcfc;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  -webkit-overflow-scrolling: touch;
}
.project-detail__command {
  position: absolute;
  top: 0;
  left: 0;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 40px;
  color: #666;
}
.project-detail__body {
  box-sizing: border-box;
  height: calc(100vh - 90px);
  padding: 8px;
  background-color: rgba(0, 0, 0, .85);
}
.project-detail__setting {
  .el-dialog__header {
    padding: 10px;
  }
  .el-dialog__body {
    padding: 0 14px 14px 14px;
  }
}
</style>