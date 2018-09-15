import React, {Component} from 'react';
import {Platform, StyleSheet, View, Animated} from 'react-native';
import Svg, {Circle, G, Path, Rect, Text, TSpan} from 'react-native-svg';
import * as d3 from "d3"

const Dimensions = require('Dimensions');

class SvgCircleWrap extends React.Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    };

    render() {
        return (
            <Circle
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}

SvgCircleWrap = Animated.createAnimatedComponent(Circle);

class SvgPathWrap extends React.Component {
    setNativeProps = (props) => {
        this._component && this._component.setNativeProps(props);
    };

    render() {
        return (
            <Path
                ref={component => (this._component = component)}
                {...this.props}
            />
        );
    }
}

SvgPathWrap = Animated.createAnimatedComponent(Path);


type Props = {};

var {height: wHeight, width: wWidth} = Dimensions.get('window');

export default class App extends Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {
            cx: 10,
            cy: 10,
            r: new Animated.Value(15),
            opacity: new Animated.Value(0),
            zoom: false,
            root: null,
            nodes: [],
            links: [],
        };
    }

    componentDidMount() {
        this.test()
    }

    test() {
        const {zoom} = this.state;

        let data = {
            "name": "Eve",
            "children": [
                {
                    "id": 1,
                    "name": "Cain",
                    "children": [
                        {
                            "id": 1,
                            "name": "Cain",
                        },
                        {
                            "id": 2,
                            "name": "Cain",
                        },
                        {
                            "id": 3,
                            "name": "Cain",
                            "children": [
                                {
                                    "id": 1,
                                    "name": "Cain",
                                },
                                {
                                    "id": 2,
                                    "name": "Cain",
                                    "children": [
                                        {
                                            "id": 1,
                                            "name": "Cain",
                                        },
                                        {
                                            "id": 2,
                                            "name": "Cain",
                                        },
                                        {
                                            "id": 3,
                                            "name": "Cain",
                                            "children": [
                                                {
                                                    "id": 1,
                                                    "name": "Cain",
                                                },
                                                {
                                                    "id": 2,
                                                    "name": "Cain",
                                                },
                                                {
                                                    "id": 3,
                                                    "name": "Cain",
                                                },
                                            ]
                                        },
                                    ]
                                },
                                {
                                    "id": 3,
                                    "name": "Cain",
                                },
                            ]
                        },
                    ]
                },
                {
                    "id": 2,
                    "name": "Cain",
                },
                {
                    "id": 3,
                    "name": "Cain",
                    "children": [
                        {
                            "id": 1,
                            "name": "Cain",
                        },
                        {
                            "id": 2,
                            "name": "Cain",
                        },
                        {
                            "id": 3,
                            "name": "Cain",
                        },
                    ]

                },
            ]
        };

        if (zoom) {
            data.children.push({
                "id": 4,
                "name": "Cain"
            })

            data.children[2].children.push({
                "id": 4,
                "name": "Cain"
            })
        }

        let root = d3.hierarchy(data);
        var tree = d3.tree().size([300, 300]).nodeSize([50, 50]);
        let nodes = tree(root);
        var links = nodes.descendants().slice(1);

        this.setState({
            ...this.state,
            root,
            links,
            nodes: nodes.descendants(),
            zoom: !this.state.zoom
        });

        Animated.parallel([
            Animated.timing(
                this.state.r,
                {
                    toValue: this.state.zoom ? 20 : 15,
                    duration: 1000,
                }
            ),
            Animated.timing(
                this.state.opacity,
                {
                    toValue: this.state.zoom ? 1 : 0,
                    duration: 1000,
                }
            )
        ]).start();
    }

    fixNodes(node) {
        return {
            ...node,
            x: node.x + wWidth / 2,
            y: node.y + wHeight / 2,
        }
    }

    fixLinks(link) {
        let a = 2;
        if (this.state.zoom) {
            a = 1
        }
        let d = `M ${link.x + wWidth / 2} ${link.y + wHeight / 2} A ${a} 1 1 1 1 ${link.parent.x + wWidth / 2} ${link.parent.y + wHeight / 2}`;

        return {
            ...link,
            x: link.x + wWidth / 2,
            y: link.y + wHeight / 2,
            d
        }
    }

    render() {
        let {nodes, links, zoom} = this.state;
        nodes = nodes.map(this.fixNodes);
        links = this.state.links.map(this.fixLinks.bind(this));

        return (
            <View style={styles.container}>
                <Svg height={wHeight} width={wWidth}>
                    {nodes.map((node, key) => {
                    return <G key={key}>
                        <SvgCircleWrap onPress={() => this.test()} cx={node.x} cy={node.y} r={this.state.r}
                                       stroke="blue" strokeWidth="2.5" fill="green"/>
                        <Rect onPress={() => this.test()} x={node.x} y={node.y} width={10} height={10}/>
                        <TSpan key={Math.random()} x={node.x} y={node.y}>Gender</TSpan>
                        {zoom && <TSpan key={Math.random()} x={node.x} y={node.y + 20}>Gender</TSpan>}
                    </G>
                })}
                    {links.map((link, key) => {
                        return <SvgPathWrap key={key} d={link.d} fill="none" stroke="red" opacity={this.state.opacity}/>
                    })}
                </Svg>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
