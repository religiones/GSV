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
import GraphRankList from './components/graph-rank-list';
import GraphNeighbor from './components/graph-neighbor';
import GraphRankGallery from './components/graph-rank-gallery';
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
          weight: 25,
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
          weight: 75,
          children:[{
            type: 'row',
            weight: 60,
            children:[
              {
                type: 'tabset',
                weight: 80,
                children:[
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
                    name: "graph rank list",
                    component:"graph-rank-list"
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
                name: "community list",
                component:"community-list"
              },
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
      case "graph-embedding":
        return <GraphEmbedding/>;
      case "graph-rank-list":
        return <GraphRankList/>;
      case "graph-neighbor":
        return <GraphNeighbor/>;
      case "graph-rank-gallery":
        return <GraphRankGallery/>;
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
