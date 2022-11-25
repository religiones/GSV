import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
// import 'flexlayout-react/style/gray.css';
// import 'flexlayout-react/style/light.css';
// import 'flexlayout-react/style/dark.css';
import 'flexlayout-react/style/underline.css';
import './App.less';
import Box from './components/box';
function App() {
  const config: IJsonModel = {
    global: { tabEnableFloat: false },
    borders: [],
    layout: {
      type: 'row',
      weight:100,
      children: [
        {
          type: 'row',
          weight: 20,
          children:[{
            type:'tabset',
            children:[
              {
                type:'tab',
                name:"Control Panel"
              }
            ]
          },{
            type:'tabset',
            children:[
              {
                type:'tab',
                name:"graph view"
              }
            ]
          }]
        },{
          type: 'row',
          weight: 80,
          children:[{
            type: 'tabset',
            weight: 60,
            children:[
              {
                type: 'tab',
                name: "graph list"
              },{
                type: 'tab',
                name: "graph gallery"
              }
            ]
          },
          {
            type: 'tabset',
            weight: 40,
            children:[
              {
                type: 'tab',
                name: "graph infomation"
              }
            ]
          }
          ]
        }
      ],
    },
  };
  const model = Model.fromJson(config);
  const factory = (node: TabNode) => {
    var component = node.getComponent();
    if(component === "box"){
      return <Box/>
    }
  };

  return (
    <div className='App'>
      <Layout model={model} factory={factory} />
    </div>
  );
}

export default App;
