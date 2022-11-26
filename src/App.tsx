import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
// import 'flexlayout-react/style/gray.css';
// import 'flexlayout-react/style/light.css';
// import 'flexlayout-react/style/dark.css';
import 'flexlayout-react/style/underline.css';
import { useEffect } from 'react';
import { connectTest } from './api/graph';
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
                name:"control panel",
                component:"control-panel"
              }
            ]
          },{
            type:'tabset',
            children:[
              {
                type:'tab',
                name:"graph view",
                component:"graph-view"
              }
            ]
          }]
        },{
          type: 'row',
          weight: 80,
          children:[{
            type: 'row',
            weight: 60,
            children:[
              {
                type: 'tabset',
                weight: 80,
                children:[
                  {
                    type: 'tab',
                    name: "community list",
                    component:"community-list"
                  }
                ]
              },
              {
                type: 'tabset',
                weight: 20,
                children:[
                  {
                    type: 'tab',
                    name: "graph embedding",
                    component:"graph-embedding"
                  }
                ]
              }
            ]
          },
          {
            type: 'tabset',
            weight: 40,
            children:[
              {
                type: 'tab',
                name: "graph infomation",
                component:"graph-infomation"
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
    if(component === "graph-infomation"){
      return <Box/>
    }
  };

  useEffect(()=>{
    connectTest().then((res)=>{
      console.log(res.data);
    });
  },[])

  return (
    <div className='App'>
      <Layout model={model} factory={factory} />
    </div>
  );
}

export default App;
