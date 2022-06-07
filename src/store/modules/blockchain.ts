import { defineStore } from 'pinia';
import { createLocalStorage } from '/@/utils/cache';
import { SERVICE_RECEIVER_ADDR_KEY } from '/@/enums/cacheEnum';

const ls = createLocalStorage();
const contractAddr =
  ls.get(SERVICE_RECEIVER_ADDR_KEY) || '0x07f7f6B71DC4e388f37c0D13E2277e384628A669';

export const useBlockchainStore = defineStore({
  id: 'blockchain',
  state: () => ({
    serviceReceiverContractAddress: contractAddr,
  }),
  getters: {
    getAddr() {
      return ls.get(SERVICE_RECEIVER_ADDR_KEY);
    },
  },
  actions: {
    setServiceReceiverContractAddress(contractAddress) {
      this.serviceReceiverContractAddress = contractAddress;
      ls.set(SERVICE_RECEIVER_ADDR_KEY, contractAddress);
    },
  },
});
