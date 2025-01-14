import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { ButterflyGL } from '../../components/butterfly-gl/ButterflyGL';
import { PageType } from '../app/App.config';
import { usePageVisible } from '../app/App.utils';
import { GAevent } from '../../utils';
import { FEATURED_ON_DATA } from './Wall.config';
import './Wall.less';

export const Wall: React.FC = () => {

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(
            '.page-wrap-wall',
            {
                display: 'block',
                opacity: 1,
            },
            {
                duration: 0.5,
                display: 'none',
                opacity: 0,
            }
        );
        return () => {
            tl.then();
        }
    }, [])
    usePageVisible(PageType.Wall, () => {
        return {
            onVisible: () => {
                GAevent('webview', 'Partners-webview');
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-wall',
                    {
                        opacity: 0,
                    },
                    {
                        duration: 0.5,
                        display: 'block',
                        opacity: 1,
                    }
                );
                return tl.then();
            },
            onHide: () => {
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-wall',
                    {
                        display: 'block',
                        opacity: 1,
                    },
                    {
                        duration: 0.5,
                        display: 'none',
                        opacity: 0,
                    }
                );
                return tl.then();
            },
        };
    });
    return (
        <div className='wall'>
            <ButterflyGL page={PageType.Wall} />
            <div className='wall__info'>
                <div className='wall__title-1'>Investors &amp; Partners</div>
                <div className='wall__dot-1'></div>
                <div className='wall__logo-1'></div>
                <div className='wall__title-2'>Featured on</div>
                <div className='wall__dot-2'></div>
                {/* <div className='wall__logo-2'></div> */}
                <div  className='wall__featured-on'>
                    {FEATURED_ON_DATA.map((item, index) => {
                        return <div key={item.name} className={`wall__featured-on-${index + 1} wall__featured-on-item`} onClick={() => {
                            window.open(item.url)
                        }}></div>
                    })}
                </div>

                {/* <div className='wall__auditor_btn'>
                    <a
                        href='https://github.com/ProjectTwelve/contracts/tree/main/audits'
                        target='_blank'
                        rel='noreferrer'
                    >
                        Audit Reports
                    </a>
                </div> */}
            </div>
        </div>
    );
};
