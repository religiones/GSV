import React, { LegacyRef, useEffect, useRef } from 'react';
import { getCommunity } from '../api/community';
import * as LineUpJs from 'lineupjs';
import "./style/community.less";
import taggle from 'lineupjs/build/src/ui/taggle';
import { buildNumberColumn, buildStringColumn } from 'lineupjs';
import { useDispatch } from 'react-redux';
import { setCommunityId, setCommunity, setCommunities, setSelectCommunities } from '../store/features/community-list-slice';
import { Community } from './@types/communi-list';

const CommunityList: React.FC<{}> = () => {
    let lineUp: taggle|null = null;
    const container: LegacyRef<HTMLDivElement>|null = useRef(null);
    const listStringWidth: number = 80;
    const listNumWidth: number = 110;
    const listCategoricalWidth: number = 78;
    const dispatch = useDispatch();

    useEffect(()=>{
        initCommunityList();
    },[]);

    const initCommunityList = () => {
        getCommunity().then(res=>{
            const data: any[] = res.data;
            data.sort((a: any, b:any)=>{
                return (b["node_num"]-a["node_num"]);
            });
            console.log(data);
            dispatch(setCommunities({communities: data}));
            if(container.current != null){
                lineUp = LineUpJs.builder(data).column(buildStringColumn('id').width(listStringWidth))
                .column(buildNumberColumn('node_num').width(listNumWidth))
                .column(buildNumberColumn('wrong_num').width(listNumWidth))
                .column(buildNumberColumn('porn').width(listCategoricalWidth))
                .column(buildNumberColumn('gambling').width(listCategoricalWidth))
                .column(buildNumberColumn('fraud').width(listCategoricalWidth))
                .column(buildNumberColumn('drug').width(listCategoricalWidth))
                .column(buildNumberColumn('gun').width(listCategoricalWidth))
                .column(buildNumberColumn('hacker').width(listCategoricalWidth))
                .column(buildNumberColumn('trading').width(listCategoricalWidth))
                .column(buildNumberColumn('pay').width(listCategoricalWidth))
                .column(buildNumberColumn('other').width(listCategoricalWidth))
                .deriveColors()
                .buildTaggle(container.current as HTMLElement);

                // add event listener
                lineUp.on('selectionChanged', (idArray: number[]) => {
                    //defalut choose the last element
                    const listId = idArray[idArray.length - 1];
                    const communityId = data[listId]["id"];
                    const community = data[listId];
                    dispatch(setCommunityId({currentCommunityId: communityId}));
                    dispatch(setCommunity({currentCommunity: community}));
                    const selectCommunities:Community[] = [];
                    idArray.forEach(id=>{
                        selectCommunities.push(data[id]);
                    });
                    dispatch(setSelectCommunities({selectCommunities: selectCommunities}));
                });
            }else{
                console.log("no listDom");
            }
        });
    }

    return (
        <div ref={container} style={{width:'100%', height:'100%'}}>
       </div>
        );
};

export default CommunityList