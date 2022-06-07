<template>
  <PageWrapper
    title="创建您的ERC20代币"
    content="轻松创建部署标准的、有上限的、可铸造的、可燃的、可支付的 ERC20 代币智能合约。 无需登录、无需设置、无需编码。"
  >
    <!-- 区块的水平、垂直间距分别为8px -->
    <Row :gutter="[8, 8]">
      <Col :xs="24" :md="8">
        <Card size="small" title="代币详情">
          <BasicForm @register="reg1" />
        </Card>
      </Col>
      <Col :xs="24" :md="8">
        <Card size="small" title="代币功能">
          <BasicForm @register="reg2" />
        </Card>
      </Col>
      <Col :xs="24" :md="8">
        <Card size="small" title="代币类型和网络">
          <BasicForm @register="reg3" />
        </Card>
        <Card size="small" title="协议" class="!mt-2">
          <Checkbox v-model:checked="agreement" />
          我已阅读、理解并同意 ERC20 代币生成器的使用条款。
        </Card>
        <Card size="small" title="交易费用" class="!my-2">
          <p>佣金: {{ tokenFee }} ETH</p>
          <p>Gas Fee: </p>
        </Card>
        <a-button type="primary" :disabled="!agreement" block @click="deployContract"
          >确认</a-button
        >
      </Col>
    </Row>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Row, Col, Card, Checkbox } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    basicSchemas,
    featuresSchemas,
    tokenContract,
    typeAndNetworkSchemas,
  } from './token.data';
  import {
    deployTokenContract,
    getTokenFee,
    switchEthereumChain,
    requestAccounts,
    checkMetaMask,
  } from './web3utils';
  import ServiceReceiver from '../../../../googol-dapp-contract/artifacts/contracts/service/ServiceReceiver.sol/ServiceReceiver.json';
  import { useBlockchainStore } from '/@/store/modules/blockchain';

  const blockchainStore = useBlockchainStore();
  const { replace } = useRouter();
  const serviceReceiverContractAddress = ref();
  const { warning } = useMessage().createMessage;
  const tokenFee = ref('0');
  const agreement = ref(false);
  const [
    reg1,
    { getFieldsValue: getTokenInfo, setFieldsValue, validateFields: validateTokenInfo },
  ] = useForm({
    schemas: basicSchemas,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  const [reg2, { setFieldsValue: setForm2FieldsValue }] = useForm({
    schemas: featuresSchemas,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    disabled: true,
  });
  const [reg3, { getFieldsValue, validateFields: validateTokenType, updateSchema }] = useForm({
    schemas: typeAndNetworkSchemas,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  // 每种Token的特征
  const tokenFeatures = {
    HelloERC20: {
      supplyType: '10k',
      accessType: 'None',
      transferType: 'Unstoppable',
    },
    SimpleERC20: {
      supplyType: 'Fixed',
      accessType: 'None',
      transferType: 'Unstoppable',
    },
    StandardERC20: {
      supplyType: 'Fixed',
      accessType: 'None',
      transferType: 'Unstoppable',
    },
    BurnableERC20: {
      supplyType: 'Fixed',
      accessType: 'None',
      transferType: 'Unstoppable',
    },
    MintableERC20: {
      supplyType: 'Capped',
      accessType: 'Ownable',
      transferType: 'Unstoppable',
    },
    PausableERC20: {
      supplyType: 'Fixed',
      accessType: 'Ownable',
      transferType: 'Pausable',
    },
    CommonERC20: {
      supplyType: 'Capped',
      accessType: 'Ownable',
      transferType: 'Unstoppable',
    },
    UnlimitedERC20: {
      supplyType: 'Unlimited',
      accessType: 'RoleBased',
      transferType: 'Unstoppable',
    },
    AmazingERC20: {
      supplyType: 'Unlimited',
      accessType: 'Ownable',
      transferType: 'Unstoppable',
    },
    PowerfulERC20: {
      supplyType: 'Capped',
      accessType: 'RoleBased',
      transferType: 'Unstoppable',
    },
  };

  const selectTokenType = ref('SimpleERC20');

  onMounted(() => {
    updateSchema({ field: 'tokenType', componentProps: { onChange: onChangeTokenType } });
    requestTokenFee(selectTokenType.value);
    serviceReceiverContractAddress.value = blockchainStore.getAddr;
  });

  // 获取选择的token合约信息
  function getSelectTokenContract() {
    return tokenContract[selectTokenType.value];
  }
  function getSelectTokenContractParams() {
    let { tokenName, tokenSymbol, tokenDecimals, initialSupply, totalSupply } = getTokenInfo();
    switch (selectTokenType.value) {
      case 'HelloERC20':
        return [tokenName, tokenSymbol, serviceReceiverContractAddress.value];
      case 'SimpleERC20':
        return [tokenName, tokenSymbol, initialSupply, serviceReceiverContractAddress.value];
      case 'StandardERC20':
        return [
          tokenName,
          tokenSymbol,
          tokenDecimals,
          initialSupply,
          serviceReceiverContractAddress.value,
        ];
      case 'BurnableERC20':
        return [
          tokenName,
          tokenSymbol,
          tokenDecimals,
          initialSupply,
          serviceReceiverContractAddress.value,
        ];
      case 'MintableERC20':
        return [
          tokenName,
          tokenSymbol,
          tokenDecimals,
          totalSupply,
          initialSupply,
          serviceReceiverContractAddress.value,
        ];
      case 'PausableERC20':
        return [
          tokenName,
          tokenSymbol,
          tokenDecimals,
          initialSupply,
          serviceReceiverContractAddress.value,
        ];
      case 'CommonERC20':
        return [
          tokenName,
          tokenSymbol,
          tokenDecimals,
          totalSupply,
          initialSupply,
          serviceReceiverContractAddress.value,
        ];
      case 'UnlimitedERC20':
        return [
          tokenName,
          tokenSymbol,
          tokenDecimals,
          initialSupply,
          serviceReceiverContractAddress.value,
        ];
      case 'AmazingERC20':
        return [
          tokenName,
          tokenSymbol,
          tokenDecimals,
          initialSupply,
          serviceReceiverContractAddress.value,
        ];
      case 'PowerfulERC20':
        return [
          tokenName,
          tokenSymbol,
          tokenDecimals,
          totalSupply,
          initialSupply,
          serviceReceiverContractAddress.value,
        ];
      default:
        return [];
    }
  }

  function deployContract() {
    const { networkType } = getFieldsValue();
    const tokenContract = getSelectTokenContract();
    const params = getSelectTokenContractParams();
    validateTokenInfo()
      .then(() => validateTokenType())
      .then(() => checkMetaMask())
      .then(() => switchEthereumChain('0x' + networkType, window.ethereum.chainId))
      .then(() => requestAccounts())
      .then(() => deployTokenContract(tokenContract, params, tokenFee.value))
      .then((contract) => {
        console.log('合约地址为: ', contract.address);
        console.log('部署合约的hash: ', contract.deployTransaction.hash);
        toManageContractPage(contract.address, getSelectTokenContract().abi);
      })
      .catch((err) => {
        if (err.code == 4001) {
          console.log('用户拒绝签名该交易', err.message);
          warning('用户拒绝签名该交易');
        } else {
          console.log('部署错误', err);
        }
      });
  }

  function toManageContractPage(contractAddr: string, contractAbi: Array<any>) {
    replace({
      name: 'manage',
      params: {
        contractAddr,
        contractAbi: JSON.stringify(contractAbi),
      },
    });
  }

  function requestTokenFee(serviceName: string) {
    getTokenFee(serviceReceiverContractAddress.value, ServiceReceiver.abi, serviceName)
      .then((price: string) => {
        tokenFee.value = price;
      })
      .catch((err) => {
        console.log('获取价格失败', err);
      });
  }

  function onChangeTokenType(e: any) {
    selectTokenType.value = e;
    requestTokenFee(e);
    setForm2FieldsValue(tokenFeatures[e]);
    setFieldsValue({ tokenType: e, supplyType: tokenFeatures[e].supplyType });
  }
</script>
<style lang="less" scoped>
  // 覆写当前页面中InputNumber控件的宽度
  :deep(.ant-input-number) {
    width: 100%;
  }
  // :deep(.ant-col) {
  //   max-width: 95%;
  // }
</style>
