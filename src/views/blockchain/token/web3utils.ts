import { ethers } from 'ethers';

export function checkMetaMask(): Promise<void> {
  return new Promise((resolve, reject) => {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      // ethereum.on('chainChanged', (_chainId) => window.location.reload());
      resolve();
    } else {
      alert('请安装MetaMask钱包');
      reject();
    }
  });
}

export function switchEthereumChain(targetChainId: string, currentChainId: string): Promise<void> {
  // console.log('currentChainId', currentChainId, 'targetChainId', targetChainId);
  if (targetChainId != currentChainId) {
    // return new Promise((resolve, reject) => {
    //   window.ethereum
    //     .request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: targetChainId }],
    //     })
    //     .then(() => resolve())
    //     .catch((e) => {
    //       reject(`网络切换失败: ${e.message}`);
    //     });
    // });
    return window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainId }],
    });
  } else {
    return Promise.resolve();
  }
}

export function requestAccounts(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts: string[] | PromiseLike<string[]>) => {
        console.log('授权账号成功', accounts);
        resolve(accounts);
      })
      .catch((e: { message: string }) => {
        // console.log('授权账号失败', e);
        reject(`授权账号失败: ${e.message}`);
      });
  });
}

export async function deployTokenContract(
  contract: any,
  contractParams: any[],
  serviceFee: string,
) {
  const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  const factory = new ethers.ContractFactory(
    contract.abi,
    contract.bytecode,
    web3Provider.getSigner(),
  );
  const deployParams = contractParams;
  if (serviceFee != '') {
    deployParams.push({
      value: ethers.utils.parseEther(serviceFee),
      gasLimit: 4100000,
    });
  }

  const tx = await factory.deploy(...deployParams);

  return tx.deployed();
  // return factory.deploy(...deployParams);
  // return factory.deploy(...contractParams, {
  //   value: ethers.utils.parseEther(serviceFee),
  //   gasLimit: 4100000,
  // });
}

export function getTokenFee(serviceReceiverAddr, serviceReceiverAbi, serviceName: string) {
  if (!serviceReceiverAddr) {
    return Promise.reject('serviceReceiverAddr is null');
  }
  const web3Provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  return web3Provider.getCode(serviceReceiverAddr).then((ret) => {
    if ('0x' == ret) {
      return Promise.reject('serviceReceiver合约未部署');
    } else {
      // 使用Provider 连接合约，将只有对合约的可读权限
      const contract = new ethers.Contract(serviceReceiverAddr, serviceReceiverAbi, web3Provider);
      // return contract['getPrice'](serviceName).then((price) => ethers.utils.formatEther(price));
      return contract.getPrice(serviceName).then((price) => ethers.utils.formatEther(price));
    }
  });
}

export function requestContractFunction(
  contractAddr,
  contractAbi,
  functionName,
  functionParams: any[],
) {
  const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  return web3Provider.getCode(contractAddr).then((ret) => {
    if ('0x' == ret) {
      return Promise.reject(contractAddr + ' 合约未部署');
    } else {
      // 使用Provider 连接合约，将只有对合约的可读权限
      const contract = new ethers.Contract(contractAddr, contractAbi, web3Provider.getSigner());
      return contract[functionName](...functionParams).then((ret) => {
        if (ret instanceof ethers.BigNumber) {
          ret = ethers.utils.formatEther(ret);
        }
        return ret;
      });
    }
  });
}
