import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
// import 'flexlayout-react/style/gray.css';
// import 'flexlayout-react/style/light.css';
// import 'flexlayout-react/style/dark.css';
import 'flexlayout-react/style/underline.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { connectTest } from './api/graph';
import './App.less';
import CommunityList from './components/community-list';
import ControlPanel from './components/control-panel';
import GraphEmbedding from './components/graph-embedding';
import GraphInformation from './components/graph-information';
import GraphNeighbor from './components/graph-neighbor';
import GraphView from './components/graph-view';


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
            children:[{
                type:'tab',
                name:"graph neighbor",
                component:"graph-neighbor"
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
                  },
                  {
                    type:'tab',
                    name:"graph view",
                    component:"graph-view"
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
                name: "graph information",
                component:"graph-information"
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
    switch(component){
      case "control-panel":
        return <ControlPanel/>;
      case "graph-view":
        return <GraphView/>;
      case "community-list":
        return <CommunityList/>;
      case "graph-information":
        return <GraphInformation/>;
      case "graph-embedding":
        return <GraphEmbedding/>;
      case "graph-neighbor":
        return <GraphNeighbor/>;
      default:
        return <></>
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
