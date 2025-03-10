import GSAP from 'gsap';

const gsap = {
  namespaced: true,
  state: {},
  actions: {
    applyAnimation(context, {data, type, cnt}) {
      const options = {}
      options.duration = 2;
      options.ease = "power2.out"; //circ.out, power1~4.in //https://gsap.com/docs/v3/Eases/
      options[type] = cnt;

      GSAP.to(data, options);
    }


  },
  mutations: {}
};

export default gsap
