'use client';
import {useEffect} from 'react';import {trackEvent} from '../lib/analytics';
export default function TrackView({slug,category}){useEffect(()=>{trackEvent('story_view',slug,{category})},[slug,category]);return null}
