const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

export class GitChecker {
  private outputPath: string;
  private triggerFilePath: string;

  constructor(outputPath: string) {
    this.outputPath = outputPath;
    this.triggerFilePath = path.join(outputPath, '../../devops-trigger.txt');
  }

  private getRandomEmoji(): string {
    const emojis = ['😀', '😎', '🚀', '🌟', '🎉'];
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
  }

  // 檢查 Git 變動
  private checkGitChanges(checkFilePath: string) {
    try {
      const result = execSync('git status --porcelain').toString();
      // console.log(result);
      // 檢查特定檔案是否有變動
      const fileChanged = result.split('\n').some((line: string) => line.includes(checkFilePath));
      return fileChanged;
    } catch (error) {
      console.error('Error checking Git changes:', error);
      return false;
    }
  }

  // 更新 trigger.txt 檔案
  private updateTriggerFile() {
    if (!fs.existsSync(this.triggerFilePath)) {
      fs.writeFileSync(this.triggerFilePath, '');
      console.log('trigger.txt file has been created successfully!');
    } else {
      fs.appendFileSync(this.triggerFilePath, this.getRandomEmoji());
      console.log('trigger.txt file has been updated successfully!');
    }
  }

  // 主邏輯
  run() {
    if (this.checkGitChanges('server-dto/')) {
      this.updateTriggerFile();
    }
  }
}
