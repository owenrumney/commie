import inquirer from 'inquirer';
import { exec } from 'child_process';


const commieTheme = {
  prefix : ''
}

async function attemptResolveBranchName(): Promise<string> {
  exec('git rev-parse --abbrev-ref HEAD', (_, stdout, __) => {
    if (stdout) {
      return stdout.replaceAll('-', ' ');
    }
  });
  return '';
}

export default async function commit() {
  const branchName = await attemptResolveBranchName();

  const answers = inquirer.prompt(
    [
      {
        type: 'list',
        name: 'type',
        message: 'Commit type?',
        choices: ['feat', 'fix', 'chore', 'enhance', 'refactor', 'test', 'docs'],
        default: 'feat',
        theme: {
          prefix: commieTheme,
        }
      },
      {
        type: 'input',
        name: 'message',
        default: branchName,
        message: 'Commit message',
        theme: commieTheme
      },
    ],
  );
}
