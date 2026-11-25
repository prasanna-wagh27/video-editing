import React from 'react';
import {registerRoot, Composition, AbsoluteFill} from 'remotion';
import '../../../shared/mai.jsx';
import {IPhone, ChatHome, Sidebar, SettingsScreen, PersScreen, CIScreen, MemoryScreen, DataScreen, ImproveScreen, UserMsg, BotMsg, SFI} from '../iphone.jsx';
const P = ({children}) => <div style={{margin: 20}}><IPhone w={500}>{children}</IPhone></div>;
const V = () => (
  <AbsoluteFill style={{background: '#EFEEEA', display: 'flex', flexWrap: 'wrap', flexDirection: 'row', padding: 20}}>
    <P><ChatHome empty={false}><UserMsg y={128}>दुकानासाठी एक पोस्ट लिहून दे</UserMsg><BotMsg y={208} lines={['Sure! Here is a general post:', {t: 'BIG SALE!', b: true}, 'Visit our store today.']} /></ChatHome></P>
    <P><Sidebar /></P><P><SettingsScreen hlPers={1} /></P><P><PersScreen ci="On" mem={1} /></P>
    <P><CIScreen work="मी पुण्यात कपड्यांचं दुकान चालवतो." traits={'नेहमी मराठीत उत्तर द्या.\nथोडक्यात, मुद्देसूद आणि उदाहरणांसह.'} focus={1} enable={1} /></P>
    <P><MemoryScreen F={999} items={[{k: 'आवड', v: 'छोटी, मुद्देसूद उत्तरं आवडतात', icon: SFI.bulb, bg: '#FF2D55', t: 0}, {k: 'कामाची पद्धत', v: 'रोज सकाळी स्टॉक आणि ऑर्डर तपासतो', icon: SFI.archive, bg: '#0A84FF', t: 0}]} /></P>
    <P><DataScreen /></P><P><ImproveScreen on={0} /></P>
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Reel" component={V} durationInFrames={1} fps={30} width={2160} height={2240} />);
