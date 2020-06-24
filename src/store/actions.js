export const holderClicked = ({ commit }, holder) => {
  commit("holderClicked", holder);
};

export const addExperiment = ({ commit }) => {
  commit("addExperiment");
};

export const handleForm = ({ commit }, payload) => {
  commit("handleForm", payload);
};

export const deleteExperiment = ({ commit }, id) => {
  commit("deleteExperiment", id);
};

export const submitExperiments = ({ commit }, experiments) => {
  commit("submitExperiments", experiments);
};

export const reOpen = ({ commit }, id) => {
  commit("reOpen", id);
};

export const edit = ({ commit }, id) => {
  commit("edit", id);
};

export const reOrder = ({ commit }, reordered) => {
  commit("reOrder", reordered);
};

export const readjustTimes = ({ commit }, payload) => {
  commit("readjustTimes", payload);
};
