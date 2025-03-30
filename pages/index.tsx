'use client';
import Router from 'next/router';
import { useEffect } from 'react';
const Home = () => {
    useEffect(() => {
        Router.push('/canvas');
    }, []);
};

export default Home;
