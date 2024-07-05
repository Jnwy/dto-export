import path from "path";
import fs from "fs-extra";
import { readDirectory } from "../lib/directory";
import { writeDtoToFile } from "./export.generator";
import chalk from "chalk";
import { processRemoveSwagger } from "./remove-swagger";
import { GitChecker } from "../lib/check-git";

export async function processDto(serverDtoPath: string) {
  // Read directory
  const filePaths = readDirectory(serverDtoPath);

  await writeDtoToFile(filePaths, serverDtoPath);

  const clientDtoFolderPath = path.join(serverDtoPath, '../dto'); // 將修改過的檔案儲存到上一層的 ./dto 資料夾內
  console.log(chalk.blue('Client Dto Folder: '), chalk.yellow(clientDtoFolderPath));

  // 如果 ./dto 資料夾不存在，則創建它
  if (!await fs.existsSync(clientDtoFolderPath)) {
    await fs.mkdirSync(clientDtoFolderPath);
  }

  await fs.copySync(serverDtoPath, clientDtoFolderPath, { recursive: true });

  await processRemoveSwagger(clientDtoFolderPath);


  const gitChecker = new GitChecker(serverDtoPath);
  gitChecker.run();
}