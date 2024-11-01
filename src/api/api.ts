// /src/api/api.ts

import { execSync } from 'child_process';
import axios from 'axios';

import config from './config';

const getCurrentCommitHash = (): string | null => {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (err) {
    return null;
  }
};

const fetchLatestCommitHashList = async (): Promise<string[] | null> => {
  try {
    const response = await axios.get(
      'https://api.github.com/repos/AurLemon/fjcpc-transfer-exam-practice-system/commits',
    );
    return response.data.map((commit: { sha: string }) => commit.sha);
  } catch (err) {
    return null;
  }
};

export const getCommitInfo = async () => {
  const localCommitHash = getCurrentCommitHash();
  if (!localCommitHash) {
    return { local_commit: null, repo_commit: null, recent_commit: 'local' };
  }

  const repoCommitHashList = await fetchLatestCommitHashList();
  if (!repoCommitHashList) {
    return {
      local_commit: localCommitHash,
      repo_commit: null,
      recent_commit: 'local',
    };
  }

  const latestRepoCommit = repoCommitHashList[0];
  let recentCommit;

  if (latestRepoCommit === localCommitHash) {
    recentCommit = 'both';
  } else if (repoCommitHashList.includes(localCommitHash)) {
    recentCommit = 'repo';
  } else {
    recentCommit = 'local';
  }

  return {
    local_commit: localCommitHash,
    repo_commit: latestRepoCommit,
    recent_commit: recentCommit,
  };
};

export const verifyIdNumber = async (id_number: string) => {
  try {
    const response = await axios.post(`${config.BASE_URL}/test32UserLogin`, {
      sfz: id_number,
    });

    return response.data;
  } catch (error) {
    throw new Error('身份证验证请求失败: ' + error.message);
  }
};

export const fetchExamQuestions = async (
  courseType: number,
  userId: string,
) => {
  try {
    const response = await axios.post(`${config.BASE_URL}/getTestSjTmInfo`, {
      lxlx: courseType,
      xsid: userId,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch exam questions: ' + error.message);
  }
};
