<!--
 * Token 服务管理
 * @author: Quinn
 * @since: 2022-06-03
 * ServiceReceiver.vue
-->
<template>
  <PageWrapper title="ERC20代币服务" content="设置不同类型ERC20代币的创建费用">
    <p>服务合约地址：{{ contractAddress }}</p>
    <a-button @click="onDeploy">部署ERC20代币服务合约</a-button>
    <a-button @click="onSetPrice">设置价格</a-button>
    <a-button @click="onGetPrice">获取价格</a-button>
    <a-button @click="getContractBalance">查询合约eth余额</a-button>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { ethers } from 'ethers';
  import { PageWrapper } from '/@/components/Page';
  import { useBlockchainStore } from '/@/store/modules/blockchain';
  import ServiceReceiver from '../../../../googol-dapp-contract/artifacts/contracts/service/ServiceReceiver.sol/ServiceReceiver.json';

  const contractAddress = ref('');
  const serviceName = 'SimpleERC20';
  const price = '0.03';

  const blockchainStore = useBlockchainStore();

  onMounted(() => {
    contractAddress.value = blockchainStore.getAddr;
  });

  function onDeploy() {
    // console.log('部署', blockchainStore.getAddr);
    blockchainStore.setServiceReceiverContractAddress(contractAddress);
  }

  async function onSetPrice() {
    let web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    // 使用Provider 连接合约，将只有对合约的可读权限
    let contract = new ethers.Contract(
      contractAddress.value,
      ServiceReceiver.abi,
      web3Provider.getSigner(),
    );
    // 使用签名器创建一个新的合约实例，它允许使用可更新状态的方法
    let contractWithSigner = contract.connect(web3Provider.getSigner());
    // 设置价格，返回交易信息
    let tx = await contractWithSigner.setPrice(serviceName, ethers.utils.parseEther(price));
    // 操作还没完成，需要等待挖矿
    await tx.wait();

    let getPrice = await contract.getPrice(serviceName);
    console.log('price=', ethers.utils.formatEther(getPrice));
  }

  async function onGetPrice() {
    let web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    // 使用Provider 连接合约，将只有对合约的可读权限
    let contract = new ethers.Contract(
      contractAddress.value,
      ServiceReceiver.abi,
      web3Provider.getSigner(),
    );
    let price = await contract.getPrice(serviceName);
    console.log('price=', ethers.utils.formatEther(price));
  }

  async function getContractBalance() {
    let web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    let balance = await web3Provider.getBalance(contractAddress.value);
    console.log('合约eth余额', ethers.utils.formatEther(balance));
  }
</script>

<style scoped></style>
