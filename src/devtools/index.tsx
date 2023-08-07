import Devtools, { pinTab } from '@src/devtools/Devtools';
import { initElement } from '@src/main';

const bootstrap = () => {
  try {
    chrome.devtools.panels.create(
      'My new Dev Tools panel',
      'src/devtools/icon-34.png',
      'src/devtools/index.html',
      (panel: chrome.devtools.panels.ExtensionPanel) => {
        console.log({ panel });
        panel.onShown.addListener(pinTab);
      }
    );
  } catch (e) {
    console.error(e);
  }
  initElement(<Devtools />);
};

bootstrap();
