<script setup lang="ts">
import './app.scss';
import CanvasComponent from './components/canvas/canvas.vue';
import TopComponent from './components/panels/top/top.vue';
import LeftComponent from './components/panels/left/left.vue';
import RightComponent from './components/panels/right/right.vue';
import BottomComponent from './components/panels/bottom/bottom.vue';
import useFocusStore from './store/focus';
import useElementsStore from './store/elements';
import useStatusStore from './store/status';

const focusStore = useFocusStore();
const statusStore = useStatusStore();

focusStore.$subscribe((_, value) => {
  if(process.env.NODE_ENV === 'development') {
    console.log(`New Focus detected:`, value.lastFocusElement);
    console.log(`Current action:`, value.action);
  }
  // set active element 
  if(value.lastFocusElement?.classList.contains('canvas'))
  useElementsStore().setSelectedElement(undefined);
});

statusStore.$subscribe((_, value) => {
  if(value.paint.paintMode) {
    statusStore.setMessage('Modo pintura');
  } else {
      statusStore.setMessage(null);
  }
});

</script>

<template>
    <div id="app">
        <div class="flexible">
          <LeftComponent />
          <div class="middle">
            <TopComponent />
            <CanvasComponent />
          </div>
          <RightComponent />
        </div>
        <BottomComponent />
    </div>
</template>
