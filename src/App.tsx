import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
// import 'flexlayout-react/style/gray.css';
// import 'flexlayout-react/style/light.css';
// import 'flexlayout-react/style/dark.css';
import 'flexlayout-react/style/underline.css';
import { useEffect } from 'react';
import { connectTest } from './api/graph';
import './App.less';
import CommunityList from './components/community-list';
import ControlPanel from './components/control-panel';
import GraphEmbedding from './components/graph-embedding';
import GraphRankGallery from './components/graph-rank-gallery';
import GraphViewNew from './components/graph-view-new';
import NodesDistanceView from './components/nodes-distance-view';
import SubGraphView from './components/subGraph-view';


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
          weight: 28,
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
                name:"subGraph View",
                component:"subGraph-view"
              }
            ]
          }]
        },{
          type: 'row',
          weight: 72,
          children:[{
            type: 'row',
            weight: 60,
            children:[
              {
                type: 'tabset',
                weight: 77,
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
                weight: 23,
                children:[
                  {
                    type:'tab',
                    name:"nodes distance",
                    component:"nodes-distance"
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
        return <GraphViewNew/>;
      case "nodes-distance":
        return <NodesDistanceView/>;
      case "community-list":
        return <CommunityList/>;
      case "graph-embedding":
        return <GraphEmbedding/>;
      case "subGraph-view":
        return <SubGraphView/>;
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
