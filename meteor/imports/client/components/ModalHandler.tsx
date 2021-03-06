
import EventEmitter = NodeJS.EventEmitter;

interface EventEmitterProps {
  on: Function;
  off: Function;
}

interface ModalHandlerProps {
  store: EventEmitterProps;
}

interface ModalHandlerState {
  modal: any;
  isOpen: boolean;
}

export class ModalHandler extends React.Component<ModalHandlerProps, ModalHandlerState> {

  constructor(props: ModalHandlerProps) {
    super(props);
    this.state = {
      modal: null,
      isOpen: false
    };
  }

  componentDidMount() {
    this.props.store.on('modal', this.onNewModal.bind(this));
  }

  componentWillUnmount() {
    this.props.store.off('modal', this.onNewModal.bind(this));
  }

  onNewModal(modal) {
    this.setState({
      modal: modal,
      isOpen: true
    });
  }

  render() {
    if (this.state.modal) {
      const modal = this.state.modal;
      modal.props.onRequestHide = this.dismiss.bind(this);
      const Modal = modal.element;
      const props = modal.props;
      props.className = (props.className ? props.className : '') + ' fullscreen';
      return (
          <Modal enforceFocus={false}  {...props}/>
      );
    } else {
      return <noscript/>;
    }
  }

  dismiss(callback) {
      this.setState({
        modal: null,
        isOpen: false
      });

      if (typeof callback === 'function') {
        callback();
      }
  }

}
