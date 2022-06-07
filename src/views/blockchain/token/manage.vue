<!--
 * 代币管理
 * @author: Quinn
 * @since: 2022-06-06
 * manage.vue
-->
<template>
  <PageWrapper title="管理您的ERC20代币" content="调用合约方法">
    <Collapse>
      <Collapse.Panel v-for="item in getContractAbi()" :key="item.name" :header="item.name">
        <!-- <p>{{ item }}</p> -->
        <BasicForm @register="item.reg">
          <template #[item.name]="{ model, field }">{{ model[field] }}</template>
        </BasicForm>
        <!-- <template v-for="ips in item.inputs" :key="ips.name">
          <div> {{ ips.name }} <Input :placeholder="ips.type" /> </div>
        </template> -->
      </Collapse.Panel>
    </Collapse>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref, unref, onMounted } from 'vue';
  import { Collapse } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { requestContractFunction } from './web3utils';

  const { currentRoute } = useRouter();
  const tokenAddress = ref();
  const tokenContractAbi = ref<any[]>([]);

  onMounted(() => {
    const { contractAddr, contractAbi } = unref(currentRoute).params;
    tokenAddress.value = contractAddr;
    if (contractAbi) {
      tokenContractAbi.value = JSON.parse(contractAbi as string);
    }
    // console.log('contract address', tokenAddress.value);
    // console.log('contract abi', tokenContractAbi.value);
  });

  function getContractAbi() {
    return tokenContractAbi.value
      .filter((item) => item.type == 'function')
      .map((f) => {
        const items = f.inputs.map((fi) => {
          return {
            field: fi.name,
            label: fi.name,
            required: true,
            component: 'Input',
            componentProps: { placeholder: fi.type },
          } as FormSchema;
        });
        items.push({
          field: 'result',
          label: '返回值',
          component: 'Input',
          slot: f.name,
          ifShow: false,
        });
        const [reg, { validate, getFieldsValue, setFieldsValue, updateSchema }] = useForm({
          schemas: items,
          showResetButton: false,
          submitButtonOptions: { text: '执行' },
          submitFunc: () => {
            return validate().then(() => {
              // console.log('values', values);
              const params = Object.values(getFieldsValue());
              // console.log('方法参数', params);
              requestContractFunction(
                tokenAddress.value,
                tokenContractAbi.value,
                f.name,
                params,
              ).then((ret) => {
                console.log('ret', ret);
                setFieldsValue({ result: ret });
                updateSchema({ field: 'result', ifShow: true });
              });
            });
          },
        });
        return { name: f.name, reg: reg };
      });
  }
</script>

<style scoped></style>
