import React, { LegacyRef, useEffect, useRef } from 'react';
import { getCommunity } from '../api/community';
import * as LineUpJs from 'lineupjs';
import "./style/community.less";
import taggle from 'lineupjs/build/src/ui/taggle';
import { buildNumberColumn, buildStringColumn } from 'lineupjs';
import { useDispatch } from 'react-redux';
import { setCommunity, setCommunities, setSelectCommunities } from '../store/features/community-list-slice';
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
            dispatch(setCommunities({communities: data}));
            if(container.current != null){
                lineUp = LineUpJs.builder(data).column(buildStringColumn('id').width(listStringWidth))
                .column(buildNumberColumn('node_num').width(listNumWidth))
                .column(buildNumberColumn('wrong_num').width(listNumWidth))
                .column(buildNumberColumn('porn').width(listCategoricalWidth).colorMapping('#f49c84'))
                .column(buildNumberColumn('gambling').width(listCategoricalWidth).colorMapping('#099EDA'))
                .column(buildNumberColumn('fraud').width(listCategoricalWidth).colorMapping('#FEE301'))
                .column(buildNumberColumn('drug').width(listCategoricalWidth).colorMapping('#ABB7BD'))
                .column(buildNumberColumn('gun').width(listCategoricalWidth).colorMapping('#F4801F'))
                .column(buildNumberColumn('hacker').width(listCategoricalWidth).colorMapping('#D6C223'))
                .column(buildNumberColumn('trading').width(listCategoricalWidth).colorMapping('#D75D73'))
                .column(buildNumberColumn('pay').width(listCategoricalWidth).colorMapping('#E0592B'))
                .column(buildNumberColumn('other').width(listCategoricalWidth).colorMapping('#58B7B3'))
                .deriveColors()
                .buildTaggle(container.current as HTMLElement);

                // add event listener
                lineUp.on('selectionChanged', (idArray: number[]) => {
                    //defalut choose the last element
                    const listId = idArray[idArray.length - 1];
                    const community = data[listId];
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