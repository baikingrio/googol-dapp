import { FormSchema } from '/@/components/Form/index';
import HelloERC20 from '../../../../googol-dapp-contract/artifacts/contracts/erc20/HelloERC20.sol/HelloERC20.json';
import SimpleERC20 from '../../../../googol-dapp-contract/artifacts/contracts/erc20/SimpleERC20.sol/SimpleERC20.json';
import StandardERC20 from '../../../../googol-dapp-contract/artifacts/contracts/erc20/StandardERC20.sol/StandardERC20.json';
import BurnableERC20 from '../../../../googol-dapp-contract/artifacts/contracts/erc20/BurnableERC20.sol/BurnableERC20.json';
import PausableERC20 from '../../../../googol-dapp-contract/artifacts/contracts/erc20/PausableERC20.sol/PausableERC20.json';
import MintableERC20 from '../../../../googol-dapp-contract/artifacts/contracts/erc20/MintableERC20.sol/MintableERC20.json';
import CommonERC20 from '../../../../googol-dapp-contract/artifacts/contracts/erc20/CommonERC20.sol/CommonERC20.json';
import UnlimitedERC20 from '../../../../googol-dapp-contract/artifacts/contracts/erc20/UnlimitedERC20.sol/UnlimitedERC20.json';
import PowerfulERC20 from '../../../../googol-dapp-contract/artifacts/contracts/erc20/PowerfulERC20.sol/PowerfulERC20.json';
import AmazingERC20 from '../../../../googol-dapp-contract/artifacts/contracts/erc20/AmazingERC20.sol/AmazingERC20.json';

// 代币基础信息表单数据项
export const basicSchemas: FormSchema[] = [
  {
    field: 'tokenName',
    component: 'Input',
    label: '代币名称',
    required: true,
  },
  {
    field: 'tokenSymbol',
    component: 'Input',
    label: '代币符号',
    helpMessage: '代币的标志,通常是3-5大写字母',
    required: true,
  },
  {
    field: 'tokenDecimals',
    component: 'InputNumber',
    label: '代币精度',
    helpMessage: '创建代币的精度,如果您不知道要设置多少,请使用默认值18。',
    defaultValue: 18,
    required: true,
    componentProps: {
      min: 0,
      max: 36,
    },
    dynamicDisabled: ({ values, model }) => {
      if (values.tokenType == 'SimpleERC20' || 'HelloERC20') {
        // 当选择SimpleERC20或HelloERC20时，精度不可编辑
        model.tokenDecimals = 18;
        return true;
      } else {
        return false;
      }
    },
  },
  {
    field: 'initialSupply',
    component: 'InputNumber',
    label: '初始供应量',
    helpMessage: '合约创建时代币的初始供应量,将存在您的账户中。',
    required: true,
    defaultValue: 10000,
    dynamicDisabled: ({ values, model }) => {
      if (values.supplyType == '10k' || values.tokenType == 'HelloERC20') {
        model.initialSupply = 10000;
        return true;
      } else {
        return false;
      }
    },
    componentProps: ({ formModel, formActionType }) => {
      return {
        min: 1,
        max: 1000000000000000,
        onChange: (e: any) => {
          if (formModel.supplyType == 'Fixed') {
            const { setFieldsValue } = formActionType;
            setFieldsValue({ totalSupply: e });
          }
        },
      };
    },
  },
  {
    field: 'totalSupply',
    component: 'InputNumber',
    label: '总供应量',
    helpMessage: '代币可以发行的最大数量',
    required: true,
    defaultValue: 10000,
    componentProps: {
      min: 1,
      max: 1000000000000000,
    },
    dynamicDisabled: ({ values, model }) => {
      if (values.supplyType == '10k') {
        model.totalSupply = 10000;
        return true;
      } else if (values.supplyType == 'Fixed') {
        model.totalSupply = model.initialSupply;
        return true;
      } else {
        return false;
      }
    },
    show: ({ values }) => {
      return values.supplyType !== 'Unlimited';
    },
    dynamicRules: ({ values }) => {
      return [
        { required: true, message: '请输入总供应量' },
        {
          validator() {
            if (values.totalSupply < values.initialSupply) {
              return Promise.reject('总供应量必须大于等于初始供应量');
            } else {
              return Promise.resolve();
            }
          },
        },
      ];
    },
  },
  {
    field: 'tokenType',
    label: 'token类型',
    component: 'Input',
    defaultValue: 'SimpleERC20',
    show: false,
  },
  {
    field: 'supplyType',
    label: '供应类型',
    component: 'Input',
    defaultValue: 'Fixed',
    show: false,
  },
];

// 代币功能表单数据
export const featuresSchemas: FormSchema[] = [
  {
    field: 'supplyType',
    component: 'Select',
    label: '供应类型',
    required: true,
    defaultValue: 'Fixed',
    componentProps: {
      options: [
        {
          label: '10k',
          value: '10k',
          key: '10k',
        },
        {
          label: '固定的',
          value: 'Fixed',
          key: 'Fixed',
        },
        {
          label: '无上限的',
          value: 'Unlimited',
          key: 'Unlimited',
        },
        {
          label: '有上限的',
          value: 'Capped',
          key: 'Capped',
        },
      ],
    },
  },
  {
    field: 'accessType',
    component: 'Select',
    label: '访问类型',
    required: true,
    defaultValue: 'None',
    componentProps: {
      options: [
        {
          label: '无',
          value: 'None',
          key: 'None',
        },
        {
          label: '可拥有',
          value: 'Ownable',
          key: 'Ownable',
        },
        {
          label: '基于角色',
          value: 'RoleBased',
          key: 'RoleBased',
        },
      ],
    },
  },
  {
    field: 'transferType',
    component: 'Select',
    label: '传输类型',
    required: true,
    defaultValue: 'Unstoppable',
    componentProps: {
      options: [
        {
          label: '不可阻挡',
          value: 'Unstoppable',
          key: 'Unstoppable',
        },
        {
          label: '可暂停',
          value: 'Pausable',
          key: 'Pausable',
        },
      ],
    },
  },
];

// 代币类型和网络表单数据
export const typeAndNetworkSchemas: FormSchema[] = [
  {
    field: 'tokenType',
    component: 'Select',
    label: '代币类型',
    required: true,
    defaultValue: 'SimpleERC20',
    componentProps: {
      options: [
        {
          label: 'HelloERC20',
          value: 'HelloERC20',
          key: 'HelloERC20',
        },
        {
          label: 'SimpleERC20',
          value: 'SimpleERC20',
          key: 'SimpleERC20',
        },
        {
          label: 'StandardERC20',
          value: 'StandardERC20',
          key: 'StandardERC20',
        },
        {
          label: 'BurnableERC20',
          value: 'BurnableERC20',
          key: 'BurnableERC20',
        },
        {
          label: 'MintableERC20',
          value: 'MintableERC20',
          key: 'MintableERC20',
        },
        {
          label: 'PausableERC20',
          value: 'PausableERC20',
          key: 'PausableERC20',
        },
        {
          label: 'CommonERC20',
          value: 'CommonERC20',
          key: 'CommonERC20',
        },
        {
          label: 'UnlimitedERC20',
          value: 'UnlimitedERC20',
          key: 'UnlimitedERC20',
        },
        {
          label: 'AmazingERC20',
          value: 'AmazingERC20',
          key: 'AmazingERC20',
        },
        {
          label: 'PowerfulERC20',
          value: 'PowerfulERC20',
          key: 'PowerfulERC20',
        },
      ],
    },
  },
  {
    field: 'networkType',
    component: 'Select',
    label: '网络',
    required: true,
    defaultValue: '1',
    componentProps: {
      options: [
        {
          label: '以太坊主网',
          value: '1',
          key: '1',
        },
        {
          label: 'Ropsten测试网',
          value: '3',
          key: '3',
        },
        {
          label: 'Rinkeby测试网',
          value: '4',
          key: '4',
        },
        {
          label: 'Goerli测试网',
          value: '5',
          key: '5',
        },
        {
          label: 'Kovan测试网',
          value: '42',
          key: '42',
        },
        {
          label: '本地测试网',
          value: '539',
          key: '539',
        },
        {
          label: 'BSC测试网',
          value: '61',
          key: '61',
        },
      ],
    },
  },
];

export const tokenContract = {
  HelloERC20,
  SimpleERC20,
  StandardERC20,
  BurnableERC20,
  PausableERC20,
  MintableERC20,
  CommonERC20,
  UnlimitedERC20,
  PowerfulERC20,
  AmazingERC20,
};
