import React from 'react';
import { Home } from '../home/Home';
import { Avatar } from '../avatar/Avatar';
import { Tree } from '../tree/Tree';
import { Poster } from '../poster/Poster';
import { About } from '../about/About';
import { Loading } from '../loading/Loading';

export enum PageType {
    Loading = 1,
    Home,
    Avatar,
    Tree,
    Poster,
    About,
}

export const CONTENT_PAGES = [
    {
        type: PageType.Loading,
        NavText: null,
        Content: <Loading />,
    },
    {
        type: PageType.Home,
        NavText: <>HOME</>,
        Content: <Home />,
    },
    {
        type: PageType.Avatar,
        NavText: <>GAME&nbsp;CHARACTER</>,
        Content: <Avatar />,
    },
    {
        type: PageType.Tree,
        NavText: <>ECONOMIC&nbsp;SYSTEM</>,
        Content: <Tree />,
    },
    {
        type: PageType.Poster,
        NavText: <>GAME&nbsp;SCENE</>,
        Content: <Poster />,
    },
    {
        type: PageType.About,
        NavText: <>ABOUT&nbsp;US</>,
        Content: <About />,
    },
    {
        type: null,
        NavText: (
            <div className='nav-community-wrap'>
                COMMUNITY
                <div className='nav-community'>
                    <a
                        href='https://twitter.com/_p12_'
                        target='_blank'
                        className='nav-community__item nav-community__item--twitter'
                    >
                        <i></i>
                        Twitter
                    </a>
                    <a
                        href='https://discord.com/invite/EMrbsZPbxs'
                        target='_blank'
                        className='nav-community__item nav-community__item--discord'
                    >
                        <i></i>
                        Discord
                    </a>
                    <a
                        href='https://t.me/project_twelve'
                        target='_blank'
                        className='nav-community__item nav-community__item--telegram'
                    >
                        <i></i>
                        Telegram
                    </a>
                </div>
            </div>
        ),
        Content: null,
    },
];
