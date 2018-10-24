import {Editor} from "./Editor";
import {KeyList} from "./KeyList";
import {Log} from "./Log";
import {Header} from "./Header/Header";
import 'bootstrap/dist/css/bootstrap.css';
import {CommandControls} from "./CommandControls";


@observer
export class Main extends Component {
    render() {
        return (
            <ReflexContainer style={{height: '100%'}}>
                <div>
                    <Header/>
                    <hr/>
                </div>
                <ReflexElement flex={1}>
                    <ReflexContainer orientation='vertical'>
                        <ReflexElement flex={0.5}>

                            <CommandControls/>
                            <hr/>
                            <KeyList/>
                            <br/>
                            <Log/>

                        </ReflexElement>
                        <ReflexSplitter/>
                        <ReflexElement flex={0.5}>

                            <Editor/>

                        </ReflexElement>
                    </ReflexContainer>
                </ReflexElement>
            </ReflexContainer>
        );
    }
}