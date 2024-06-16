import inquirer from 'inquirer';
import confirm from '@inquirer/confirm';
import { exec, spawn } from 'child_process';

const commieTheme = {
  prefix: '',
};

async function attemptResolveBranchName(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
      if (stdout) {
        resolve(stdout.trim());
      } else {
        resolve('');
      }
    });
  });
}

export default async function commit() {
  const branchName = await attemptResolveBranchName();

  addInitialCommitMessage(branchName).then((success) => {
    if (success) {
      addCommitBody();
    }
  });
}

async function addCommitBody() {
  const addMessage = await confirm({ message: 'Add a body to the commit?' });
  if (addMessage) {
    const shell = spawn('git', ['commit', '--amend'], { stdio: 'inherit' });
    shell.on('exit', (code: number) => {
      if (code === 0) {
        console.log('Commit successful!');
      } else {
        console.error('Commit failed');
      }
    });
  }
}


async function addInitialCommitMessage(branchName: string): Promise<boolean>{
    const commitMessage = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Commit type?',
      choices: ['feat', 'fix', 'chore', 'enhance', 'refactor', 'test', 'docs'],
      default: 'feat',
      theme: {
        prefix: commieTheme,
      },
    },
    {
      type: 'input',
      name: 'message',
      default: branchName,
      message: 'Commit message',
      theme: commieTheme,
    },
  ]);

  const confirmCommit = await confirm({ message: 'Are you sure you want to commit?' });
  if (confirmCommit) {
    exec(`git commit -m "${commitMessage.type}: ${commitMessage.message}"`, (err, _stdout) => {
      if (err) {
        console.error(err);
        return false;
      }
    });
  }
  return true;
}