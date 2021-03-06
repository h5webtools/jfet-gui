/**
 * event
 */

import { ipcRenderer } from 'electron';
import path from 'path';
import fse from 'fs-extra';
import store from '@/store';
import mainGlobal from '@/util/main_global';
import { Notification } from 'element-ui';

const { JFET_GUI_SETTING_DIR_NAME } = mainGlobal.constants;

ipcRenderer.on('selected-directory', (event, args) => {
  if (Array.isArray(args)) {
    args.forEach(async (arg) => {
      // const exist = await fse.pathExists(path.join(arg, JFET_GUI_SETTING_DIR_NAME));
      // if (exist) {
      //   openJfetProject(arg);
      // } else {
        openOtherProject(arg);
      // }
    });
  }
});

function openOtherProject(dir) {
  const pathname = path.basename(dir);
  store.dispatch('project/addProject', {
    name: pathname,
    path: dir
  }).then((result) => {
    if (!result.success) {
      Notification.error({
        title: '错误',
        message: result.message
      });
    }
  });
}

function openJfetProject(dir) {

}
